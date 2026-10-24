---
id: lesson-ai-recommendation-feedback
kind: lesson
topicId: ai-search-recommendations
title: Recommendation Systems, Feedback, and Personalization
summary: Understand candidate generation, ranking objectives, feedback bias, and safe personalization.
difficulty: medium
status: published
revision: 1
order: 200
tags: [recommendations, personalization, ranking]
---

## Recommendations are decisions under uncertainty

A recommender chooses which eligible items to show for a user and context. A common
pipeline retrieves candidates from popularity, collaborative signals, content
similarity, or a combination, then ranks them for an objective such as useful
engagement, completion, or retention.

Separate the user's observed behavior from the user's true preference. A click can
mean interest, but it can also result from position, curiosity, or a misleading
title. A missing click may mean the item was never visible.

## Feedback loops

Ranking affects what users see, which affects the data later used to train ranking.
This exposure bias can make popular items appear more relevant and prevent new items
from receiving evidence. Use exploration, randomized or interleaved evaluation,
negative sampling carefully, and record exposure separately from interaction.

Personalization must not bypass eligibility. Tenant boundaries, privacy rules,
muted categories, age restrictions, and inventory availability are hard filters.
Personal signals should be minimized, explainable where appropriate, and subject to
retention and deletion policies.

## Measure more than clicks

Evaluate relevance, coverage, diversity, novelty, calibration, latency, and business
or user outcomes. Slice by new users, cold-start items, language, device, and sparse
history. A higher click-through rate can still indicate worse user value if it comes
from clickbait or repetitive recommendations.

Use a fallback for cold start: popular items within the user's eligible scope,
content-based similarity, or editorial rules. Make the fallback observable so it is
not mistaken for a personalized model success.

## Recall

Why is exposure different from a negative preference? Which rules must be applied
before personalization? Name two metrics that protect against repetitive results.
