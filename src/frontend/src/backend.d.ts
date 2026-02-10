import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SeoImpactRange {
    max: bigint;
    min: bigint;
}
export type Timestamp = bigint;
export interface ContentDraft {
    id: bigint;
    metaDescription: string;
    created: Timestamp;
    topic: string;
    seoTags: Array<string>;
    author: Principal;
    keywords: Array<string>;
    versionHistory: Array<ContentDraftVersion>;
    updated: Timestamp;
    sections: Array<BlogSection>;
    mainImage?: ExternalBlob;
}
export interface BlogSection {
    title: string;
    content: string;
}
export interface SubmissionPlan {
    status: ListingStatus;
    created: Timestamp;
    userId: Principal;
    updated: Timestamp;
    notes: string;
    platformId: bigint;
    submissionDate?: Timestamp;
    submissionUrl?: string;
}
export interface PlatformCatalogEntry {
    id: bigint;
    region: string;
    created: Timestamp;
    country: string;
    estimatedTraffic: SeoImpactRange;
    submissionGuide: string;
    name: string;
    description: string;
    updated: Timestamp;
    category: PlatformCategory;
    estimatedSeoImpact: SeoImpactRange;
    requirements: string;
}
export interface ContentDraftVersion {
    created: Timestamp;
    content: ContentDraft;
    versionNumber: bigint;
}
export interface KeywordMetric {
    clicks: bigint;
    period: string;
    impressions: bigint;
    timestamp: Timestamp;
    avgPosition: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    organization?: string;
}
export enum ListingStatus {
    notStarted = "notStarted",
    submitted = "submitted",
    rejected = "rejected",
    accepted = "accepted",
    inProgress = "inProgress"
}
export enum PlatformCategory {
    forum = "forum",
    directory = "directory",
    news = "news",
    reviewSite = "reviewSite",
    contentSharing = "contentSharing",
    socialMedia = "socialMedia"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContentDraftVersion(draftId: bigint, version: ContentDraftVersion): Promise<void>;
    addKeywordMetric(title: string, metric: KeywordMetric): Promise<void>;
    addPlatformCatalogEntry(entry: PlatformCatalogEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateSubmissionPlan(plan: SubmissionPlan): Promise<void>;
    generateOrUpdateContentDraft(draft: ContentDraft): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getKeywordMetrics(title: string, period: string): Promise<Array<KeywordMetric>>;
    getSubmissionPlans(userId: Principal): Promise<Array<SubmissionPlan>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchCatalogEntries(category: PlatformCategory | null, country: string | null): Promise<Array<PlatformCatalogEntry>>;
    updatePlatformCatalogEntry(id: bigint, entry: PlatformCatalogEntry): Promise<void>;
}
