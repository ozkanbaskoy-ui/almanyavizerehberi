const EMAIL_SPLIT_RE = /[;,\n]/;

function splitEmailList(value?: string | null) {
  return (value || '')
    .split(EMAIL_SPLIT_RE)
    .map((email) => email.trim())
    .filter(Boolean);
}

function uniqueEmails(emails: string[]) {
  const seen = new Set<string>();

  return emails.filter((email) => {
    const key = email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isPlausibleEmail(email: string) {
  return email.includes('@') && !email.startsWith('@') && !email.endsWith('@');
}

export function getRecipientEmails(
  siteContactEmail?: string,
  envValues: Array<string | undefined | null> = [],
) {
  const envEmails = uniqueEmails(
    envValues.flatMap((value) => splitEmailList(value)),
  ).filter(isPlausibleEmail);

  if (envEmails.length > 0) {
    return envEmails;
  }

  return uniqueEmails(
    siteContactEmail ? [siteContactEmail.trim()] : [],
  ).filter(isPlausibleEmail);
}
