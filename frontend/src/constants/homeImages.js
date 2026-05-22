/**
 * Home page images — paths must match public/media/images/ exactly (case-sensitive on Vercel).
 * Files: ecosystem.png, education.svg
 */
const base = process.env.PUBLIC_URL || '';

export const ECOSYSTEM_IMAGE = `${base}/media/images/ecosystem.png`;
export const EDUCATION_IMAGE = `${base}/media/images/education.svg`;
