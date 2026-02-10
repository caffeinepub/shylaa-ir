import type { ContentDraft } from '../backend';
import { countPersianWords } from './locale';

interface SeoCheck {
  title: string;
  message: string;
  passed: boolean;
  weight: number;
}

interface SeoAnalysis {
  score: number;
  checks: SeoCheck[];
  suggestions: string[];
}

export function analyzeSeo(draft: ContentDraft, language: string): SeoAnalysis {
  const checks: SeoCheck[] = [];
  const suggestions: string[] = [];

  // Combine all content
  const allContent = draft.sections.map((s) => s.content).join(' ');
  const wordCount = countPersianWords(allContent);

  // Check 1: Content length
  const minWords = 300;
  const idealWords = 1000;
  const contentLengthPassed = wordCount >= minWords;
  checks.push({
    title: 'Content Length',
    message: `${wordCount} words (minimum: ${minWords}, ideal: ${idealWords})`,
    passed: contentLengthPassed,
    weight: 20,
  });
  if (!contentLengthPassed) {
    suggestions.push(`Add at least ${minWords - wordCount} more words to meet minimum length.`);
  }

  // Check 2: Meta description length
  const metaLength = draft.metaDescription.length;
  const metaDescPassed = metaLength >= 120 && metaLength <= 160;
  checks.push({
    title: 'Meta Description',
    message: `${metaLength} characters (ideal: 120-160)`,
    passed: metaDescPassed,
    weight: 15,
  });
  if (!metaDescPassed) {
    if (metaLength < 120) {
      suggestions.push('Meta description is too short. Aim for 120-160 characters.');
    } else {
      suggestions.push('Meta description is too long. Keep it under 160 characters.');
    }
  }

  // Check 3: Keywords present
  const keywordsPassed = draft.keywords.length >= 3;
  checks.push({
    title: 'Keywords',
    message: `${draft.keywords.length} keywords (minimum: 3)`,
    passed: keywordsPassed,
    weight: 15,
  });
  if (!keywordsPassed) {
    suggestions.push('Add at least 3 relevant keywords.');
  }

  // Check 4: Keyword density
  let keywordDensityPassed = true;
  if (draft.keywords.length > 0 && wordCount > 0) {
    draft.keywords.forEach((keyword) => {
      const keywordCount = (allContent.match(new RegExp(keyword, 'gi')) || []).length;
      const density = (keywordCount / wordCount) * 100;
      if (density < 0.5 || density > 2.5) {
        keywordDensityPassed = false;
        suggestions.push(`Keyword "${keyword}" density is ${density.toFixed(2)}%. Aim for 0.5-2.5%.`);
      }
    });
  }
  checks.push({
    title: 'Keyword Density',
    message: keywordDensityPassed ? 'Keywords are well distributed' : 'Some keywords need adjustment',
    passed: keywordDensityPassed,
    weight: 15,
  });

  // Check 5: Heading structure
  const hasIntro = draft.sections.some((s) => s.title.toLowerCase().includes('intro') || s.title.includes('مقدمه'));
  const hasBody = draft.sections.some((s) => s.title.toLowerCase().includes('body') || s.title.includes('متن'));
  const hasConclusion = draft.sections.some((s) => s.title.toLowerCase().includes('conclusion') || s.title.includes('نتیجه'));
  const structurePassed = hasIntro && hasBody && hasConclusion;
  checks.push({
    title: 'Article Structure',
    message: structurePassed ? 'Has intro, body, and conclusion' : 'Missing key sections',
    passed: structurePassed,
    weight: 15,
  });
  if (!structurePassed) {
    suggestions.push('Ensure your article has introduction, body, and conclusion sections.');
  }

  // Check 6: Tags
  const tagsPassed = draft.seoTags.length >= 3;
  checks.push({
    title: 'SEO Tags',
    message: `${draft.seoTags.length} tags (minimum: 3)`,
    passed: tagsPassed,
    weight: 10,
  });
  if (!tagsPassed) {
    suggestions.push('Add at least 3 SEO tags.');
  }

  // Check 7: Reading time
  const readingTime = Math.ceil(wordCount / 200);
  const readingTimePassed = readingTime >= 3 && readingTime <= 15;
  checks.push({
    title: 'Reading Time',
    message: `~${readingTime} minutes (ideal: 3-15 minutes)`,
    passed: readingTimePassed,
    weight: 10,
  });
  if (!readingTimePassed) {
    if (readingTime < 3) {
      suggestions.push('Content is too short. Add more valuable information.');
    } else {
      suggestions.push('Content is very long. Consider breaking it into multiple articles.');
    }
  }

  // Calculate score
  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = checks.reduce((sum, check) => (check.passed ? sum + check.weight : sum), 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  return { score, checks, suggestions };
}
