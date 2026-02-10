import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Result "mo:core/Result";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Timestamp = Time.Time;
  type Suburb = Text;

  // --- User Profile ---
  public type UserProfile = {
    name : Text;
    email : ?Text;
    organization : ?Text;
  };

  // --- Platform Catalog (Listings) ---
  type PlatformCategory = {
    #directory;
    #forum;
    #socialMedia;
    #contentSharing;
    #reviewSite;
    #news;
  };

  type SeoImpactRange = {
    min : Nat;
    max : Nat;
  };

  public type ListingStatus = {
    #notStarted;
    #inProgress;
    #submitted;
    #accepted;
    #rejected;
  };

  module PlatformCatalogEntry {
    public func compare(entry1 : PlatformCatalogEntry, entry2 : PlatformCatalogEntry) : Order.Order {
      Text.compare(entry1.name, entry2.name);
    };
  };

  public type PlatformCatalogEntry = {
    id : Nat;
    name : Text;
    description : Text;
    category : PlatformCategory;
    country : Text;
    region : Text;
    estimatedSeoImpact : SeoImpactRange;
    estimatedTraffic : SeoImpactRange;
    requirements : Text;
    submissionGuide : Text;
    created : Timestamp;
    updated : Timestamp;
  };

  // --- User Submission Plan ---
  public type ListingStatusUpdate = {
    status : ListingStatus;
    lastUpdated : Timestamp;
    notes : Text;
    submittedUrl : ?Text;
    submissionDate : ?Timestamp;
  };

  public type SubmissionPlan = {
    platformId : Nat;
    userId : Principal;
    status : ListingStatus;
    notes : Text;
    submissionUrl : ?Text;
    submissionDate : ?Timestamp;
    created : Timestamp;
    updated : Timestamp;
  };

  // --- Content Workspace (SEO Content Generator) ---
  public type BlogSection = {
    title : Text;
    content : Text;
  };

  public type ContentDraft = {
    id : Nat;
    topic : Text;
    mainImage : ?Storage.ExternalBlob;
    sections : [BlogSection];
    metaDescription : Text;
    seoTags : [Text];
    keywords : [Text];
    author : Principal;
    versionHistory : [ContentDraftVersion];
    created : Timestamp;
    updated : Timestamp;
  };

  public type ContentDraftVersion = {
    content : ContentDraft;
    versionNumber : Nat;
    created : Timestamp;
  };

  public type KeywordSuggestion = {
    keyword : Text;
    searchVolume : Nat;
    competition : Nat;
    relevance : Nat;
  };

  public type KeywordMetric = {
    impressions : Nat;
    clicks : Nat;
    avgPosition : Nat;
    period : Text;
    timestamp : Timestamp;
  };

  // ---- State ----
  var nextPlatformId = 1;
  var nextContentDraftId = 1;

  // State Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let platformCatalog = Map.empty<Nat, PlatformCatalogEntry>();
  let submissionPlans = Map.empty<Principal, SubmissionPlan>();
  let contentDrafts = Map.empty<Nat, ContentDraft>();
  let keywordMetrics = Map.empty<Text, KeywordMetric>();

  // ---- User Profile Functions ----
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ---- Admin Functions (restricted) ----
  public shared ({ caller }) func addPlatformCatalogEntry(entry : PlatformCatalogEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add platform entries");
    };

    let newEntry = {
      entry with
      id = nextPlatformId;
      created = Time.now();
      updated = Time.now();
    };
    platformCatalog.add(nextPlatformId, newEntry);
    nextPlatformId += 1;
  };

  public shared ({ caller }) func updatePlatformCatalogEntry(id : Nat, entry : PlatformCatalogEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update platform entries");
    };

    switch (platformCatalog.get(id)) {
      case (null) { Runtime.trap("Entry not found") };
      case (?_) {
        let updatedEntry = { entry with updated = Time.now() };
        platformCatalog.add(id, updatedEntry);
      };
    };
  };

  // ---- User Features ----
  public shared ({ caller }) func createOrUpdateSubmissionPlan(plan : SubmissionPlan) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create submission plans");
    };
    
    if (caller != plan.userId) {
      Runtime.trap("Unauthorized: Can only create/update your own submission plans");
    };

    let validPlan = { plan with updated = Time.now() };
    submissionPlans.add(caller, validPlan);
  };

  public query ({ caller }) func getSubmissionPlans(userId : Principal) : async [SubmissionPlan] {
    // Users can only view their own plans, admins can view all
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own submission plans");
    };

    let plansIter = submissionPlans.entries().filter(func((k, v)) { k == userId }).map(func((_, v)) { v });
    plansIter.toArray();
  };

  // ---- Content Workspace Features ----
  public shared ({ caller }) func generateOrUpdateContentDraft(draft : ContentDraft) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create drafts");
    };

    // Check ownership when updating existing draft
    switch (contentDrafts.get(draft.id)) {
      case (?existingDraft) {
        if (existingDraft.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own drafts");
        };
      };
      case (null) {
        // New draft, no ownership check needed
      };
    };

    let draftId = switch (contentDrafts.get(draft.id)) {
      case (null) {
        let newId = nextContentDraftId;
        nextContentDraftId += 1;
        newId;
      };
      case (_) { draft.id };
    };

    let finalDraft = {
      draft with
      id = draftId;
      author = caller;
      updated = Time.now();
    };
    contentDrafts.add(draftId, finalDraft);
  };

  public shared ({ caller }) func addContentDraftVersion(draftId : Nat, version : ContentDraftVersion) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add versions");
    };

    switch (contentDrafts.get(draftId)) {
      case (null) { Runtime.trap("Draft not found") };
      case (?draft) {
        // Verify ownership
        if (draft.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only add versions to your own drafts");
        };

        let newHistory = draft.versionHistory.concat([version]);
        let updatedDraft = { draft with versionHistory = newHistory };
        contentDrafts.add(draftId, updatedDraft);
      };
    };
  };

  public query ({ caller }) func searchCatalogEntries(category : ?PlatformCategory, country : ?Text) : async [PlatformCatalogEntry] {
    // Available to all users including guests - no authorization check needed
    let filteredIter = platformCatalog.values().filter(
      func(entry) {
        (switch (category) {
          case (null) { true };
          case (?cat) { entry.category == cat };
        }) and (switch (country) {
          case (null) { true };
          case (?c) { entry.country == c };
        })
      }
    );
    filteredIter.toArray();
  };

  // Keyword Management
  public shared ({ caller }) func addKeywordMetric(title : Text, metric : KeywordMetric) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add keyword metrics");
    };
    keywordMetrics.add(title, metric);
  };

  public query ({ caller }) func getKeywordMetrics(title : Text, period : Text) : async [KeywordMetric] {
    // Available to authenticated users (not guests)
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view keyword metrics");
    };

    let iter = keywordMetrics.entries();
    let metricEntries = iter.filter(
      func((_, m)) { m.period == period and title == title }
    );
    let metricsIter = metricEntries.map(func((_, m)) { m });
    metricsIter.toArray();
  };
};
