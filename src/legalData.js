/* Every word of the site's legal pages, as data.
 *
 * WHY THIS FILE EXISTS AT ALL
 * ---------------------------
 * A privacy policy is only worth having if it is TRUE. A generated one that
 * says "we use cookies to personalise your experience" on a site that sets no
 * cookies is not protection, it is a written admission that nobody checked.
 * The regulator's first question is always "does the document describe what
 * the system does", and the answer has to be yes.
 *
 * So everything below was written against worker/index.js and public/_headers
 * rather than from a template. Each claim maps to a line of code:
 *
 *   "name, contact, message"      -> saveMessage() in worker/index.js
 *   "country and referring page"  -> cf-ipcountry / referer, same file
 *   "kept for 24 months"          -> RETENTION_TTL in worker/index.js
 *   "no advertising cookies"      -> _headers CSP has no ad host in script-src
 *   "spam check by Cloudflare"    -> verifyTurnstile()
 *
 * THE RULE FOR EDITING THIS FILE: if you change what the site collects,
 * change this file in the same commit. A policy that drifts from the code is
 * worse than no policy, because it is evidence of a claim you did not keep.
 *
 * ⚠ BEFORE THIS GOES LIVE: every [FILL IN] below must be replaced with a real
 * value. They are deliberately loud so they cannot ship by accident, and
 * LEGAL_TODO at the bottom lists them in one place. Claude did not invent a
 * legal entity, an address or a jurisdiction for you: naming a business that
 * does not exist, or an address you do not hold, turns a protective document
 * into a misrepresentation, which is the opposite of the point.
 */

import { CONTACT } from "./siteData";

/* ── Who is behind the site ───────────────────────────────────────────────
 *
 * "Controller" is the GDPR word for whoever decides why personal data is
 * collected. On a one-person business that is the person, and a sole trader
 * naming themselves is a perfectly valid answer. What is NOT valid is leaving
 * it vague: a data subject has to be able to work out who to write to.
 *
 * `legalName` is the name you would sign a contract under. If you have never
 * registered a company, that is your own full name, and that is fine. Do not
 * invent a company.
 *
 * `address` is required. GDPR Art. 13(1)(a) wants the controller's identity
 * and contact details, and Lebanese Law 81/2018 expects the same of anyone
 * processing personal data. A city alone is not enough on a document people
 * are told to send legal notices to. If you do not want your home address
 * public, the usual answer is a lawyer's address, an accountant's, or a
 * registered office service, NOT omitting it.
 */
export const BUSINESS = {
  // Real, from siteData.js.
  tradingName: "Tamer AO",
  site: "tamerabouomar.com",
  email: CONTACT.email,
  phone: CONTACT.phone,
  country: "Lebanon",
  city: "Beirut",

  // ⚠ NOT real. Must be filled before publishing.
  legalName: "[FILL IN: your full legal name, or the registered company name]",
  address: "[FILL IN: full postal address for legal notices]",
  registration:
    "[FILL IN: commercial register / VAT number, or delete this line if you are not registered]",
};

/* The date the current wording took effect. Bump it whenever the substance
   changes, not for a typo: people are entitled to know a policy moved under
   them, and a date that changes on every deploy tells them nothing. */
export const LEGAL_UPDATED = "[FILL IN: date you publish, e.g. 6 September 2026]";

/* ── The shape a policy page is written in ────────────────────────────────
 *
 * { title, intro, sections: [{ h, p: [...], list: [...] }] }
 *
 * `p` is paragraphs, `list` is bullets, and a section may have either or
 * both. Deliberately not markdown: this renders into the site's own
 * components, so it inherits the site's type and spacing instead of arriving
 * as a wall of unstyled prose in a different font from every other page.
 */

/* =========================================================================
   PRIVACY POLICY
   ========================================================================= */
export const PRIVACY = {
  slug: "privacy",
  title: "Privacy Policy",
  lede:
    "What this site collects, why, how long it is kept and how to get it deleted. It is short because the site collects very little.",
  sections: [
    {
      h: "Who is responsible for your data",
      p: [
        `${BUSINESS.legalName}, trading as ${BUSINESS.tradingName}, of ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.country}. In data protection law this makes me the "controller": the person who decides what is collected and why.`,
        `To ask anything about your data, or to have it deleted, email ${BUSINESS.email}. I answer these myself, and within 30 days.`,
      ],
    },
    {
      h: "What this site collects",
      p: [
        "Nothing at all until you send something. There is no account, no login and no profile built on you in the background.",
        "When you use one of the forms, I receive only what you typed into it:",
      ],
      list: [
        "Send a message: your name, an email address or WhatsApp number, and your message.",
        "Download a free template: your name, an email address or WhatsApp number, and which template you took.",
        "Claim a free offer: your name, a contact, which offer, and anything you chose to write about your business.",
        "Leave feedback: what you thought and what would improve it. Contact details are optional here and the form works without them.",
      ],
    },
    {
      h: "What is recorded automatically",
      p: [
        "Alongside anything you send, three things are recorded that you did not type:",
      ],
      list: [
        "The country your request came from, as a two-letter code. Cloudflare works this out from your IP address and passes on the country only. Your IP address itself is not stored in my records.",
        "The page you were on when you sent it, so I know which page prompted you to get in touch.",
        "The date and time.",
      ],
    },
    {
      h: "Why I am allowed to hold it",
      p: [
        "Under the GDPR, for visitors it applies to, the lawful bases are these. Where you filled in a form and ticked the consent box, that is consent (Article 6(1)(a)), and you can withdraw it at any time. Where we go on to discuss or do work together, that is the performance of a contract and the steps leading up to one (Article 6(1)(b)). The spam checking and rate limiting that protect the forms rest on legitimate interests (Article 6(1)(f)): without them the forms are filled by scripts and stop being usable by people.",
        "Withdrawing consent does not undo anything done before you withdrew it, and it does not reach data I have to keep for tax or accounting reasons.",
      ],
    },
    {
      h: "How long it is kept",
      p: [
        "Enquiries, template downloads, offer claims and feedback are deleted automatically 24 months after they arrive. This is enforced by the storage itself rather than by me remembering to do it, so it happens whether or not anyone is watching.",
        "If we end up working together, records connected to that work are kept for as long as the law requires me to keep business and tax records, and no longer.",
        "You do not have to wait for the 24 months. Ask and it goes.",
      ],
    },
    {
      h: "Who else sees it",
      p: [
        "I do not sell your data, I do not share it for anyone else's marketing, and there is no advertising network on this site. A small number of suppliers necessarily handle it in order for the site to work:",
      ],
      list: [
        "Cloudflare, Inc. hosts the site, stores the form submissions, and runs the anti-spam check on the forms. They process the data on my instructions.",
        "Telegram Messenger, when a form is submitted, receives a copy of that submission as a notification so I see it immediately.",
        "Calendly, if you choose to load and use the booking calendar, receives whatever you enter into it in order to make the booking. Their privacy policy governs that.",
        "Instagram (Meta), if you choose to load an embedded post, receives your IP address and may set cookies, in the same way as if you had visited Instagram directly. Nothing from Instagram loads until you click to load it.",
      ],
      after: [
        "Cloudflare and Telegram are outside Lebanon and outside the EEA. Cloudflare's transfers rest on the European Commission's Standard Contractual Clauses. If you would rather nothing left the country, use the phone number instead of the forms.",
      ],
    },
    {
      h: "Cookies",
      p: [
        "This site sets no cookies of its own, and there are no advertising or profiling cookies on it. Visitor numbers are counted by Cloudflare Web Analytics, which is cookieless and does not track anyone between sites. Third-party embeds are the only things here that would set a cookie, and none of them load until you click to load them. The Cookie Policy explains this in full.",
      ],
    },
    {
      h: "Your rights",
      p: [
        "Where the GDPR applies to you, you have the right to ask for a copy of what I hold, to have it corrected, to have it deleted, to restrict or object to what I do with it, to receive it in a portable form, and to withdraw consent. Lebanese Law No. 81/2018 gives comparable rights of access and correction to people in Lebanon.",
        `All of them work the same way here: email ${BUSINESS.email} and ask. There is no charge and no form to fill in.`,
        "If you think I have handled your data badly, please tell me first, because it is usually a mistake I can fix quickly. You also have the right to complain to your national data protection authority.",
      ],
    },
    {
      h: "Children",
      p: [
        "This site is aimed at businesses and adults, and I do not knowingly collect anything from a child under 16. Where coaching involves a minor, arrangements are made with a parent or guardian directly, not through this site. If you believe a child has sent something through a form here, email me and I will delete it.",
      ],
    },
    {
      h: "Security",
      p: [
        "The site is served only over HTTPS. Submissions are stored on Cloudflare's infrastructure and are readable only with a secret token that I hold. The forms are protected by rate limiting and an anti-spam check. No card details are ever taken on this site, on any page, and nothing here asks you for one.",
        "No system is perfect, and anyone who tells you otherwise is selling something. If you find a way in, please email me rather than anyone else.",
      ],
    },
    {
      h: "Changes",
      p: [
        `This policy was last updated on ${LEGAL_UPDATED}. If it changes in a way that matters, the date changes with it and the new version is here.`,
      ],
    },
  ],
};

/* =========================================================================
   COOKIE POLICY

   The honest version. Most cookie policies on small sites are copied from a
   site that does have advertising, which is why they list four categories of
   tracker that do not exist. This one lists what is actually there, and the
   answer is close to nothing, which is worth saying plainly rather than
   burying under boilerplate.
   ========================================================================= */
export const COOKIES = {
  slug: "cookies",
  title: "Cookie Policy",
  lede:
    "This site sets no cookies of its own and shows no cookie banner, because there is nothing to consent to until you ask for it.",
  sections: [
    {
      h: "The short version",
      p: [
        "There are no advertising cookies, no analytics cookies and no profiling cookies here. Nothing follows you to other sites. You are not being tracked between visits.",
        "That is why there is no banner. A consent banner exists to ask permission for non-essential tracking, and asking for permission to do nothing would be theatre.",
      ],
    },
    {
      h: "How visitors are counted",
      p: [
        "Visitor numbers come from Cloudflare Web Analytics, which counts page views without cookies and without building a profile of anyone. It cannot follow you to another site, because it has nothing to follow you with. Under the ePrivacy rules this does not need consent, because it stores nothing on your device.",
      ],
    },
    {
      h: "The forms",
      p: [
        "The forms are protected by Cloudflare Turnstile, which checks that a submission came from a person rather than a script. It may store a short-lived token on your device while it does that. This is strictly necessary: it is what stops the forms from being unusable, so it is exempt from consent, and it is not used to identify or track you.",
      ],
    },
    {
      h: "Embedded content, and why you have to click it",
      p: [
        "Two things on this site come from other companies: Instagram posts, and the Calendly booking calendar. Both would set their own cookies and see your IP address the moment they loaded.",
        "So they do not load on their own. Each one shows a placeholder with a button, and nothing is requested from Instagram or Calendly until you press it. Clicking the button is your consent for that embed, in that session, and nothing else on the page changes.",
        "If you never press it, Instagram and Calendly never learn you were here. If you would rather book without loading the calendar at all, the same booking link opens in a new tab, and the phone number and email work as they always have.",
      ],
    },
    {
      h: "Clearing what is there",
      p: [
        "Because nothing persistent is set from this site, there is nothing here to clear. Anything left by an embed you loaded is cleared the normal way, through your browser's settings for that site. Blocking third-party cookies entirely will not break anything on this site.",
      ],
    },
    {
      h: "Changes",
      p: [
        `Last updated ${LEGAL_UPDATED}. If a tool is ever added that does set a cookie, this page changes before it ships, and a consent banner arrives with it.`,
      ],
    },
  ],
};

/* =========================================================================
   TERMS AND CONDITIONS

   The job here is to write down what is already true. The site makes several
   specific, measurable promises (see the `guarantee` fields in siteData.js)
   and those promises are the most legally significant thing on it: a stated
   guarantee is an enforceable term whether or not it is written into a
   contract, so it is far safer to state its boundaries than to leave a
   customer and a court to infer them.
   ========================================================================= */
export const TERMS = {
  slug: "terms",
  title: "Terms and Conditions",
  lede:
    "The rules for using this site, taking the free templates, and buying the services on it. Written to be read, not to be survived.",
  sections: [
    {
      h: "Who you are dealing with",
      p: [
        `This site is operated by ${BUSINESS.legalName}, trading as ${BUSINESS.tradingName}, of ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.country}. "I" and "me" below mean that person. "You" means you.`,
        "Using the site means you accept these terms. If you do not accept them, the site is still free to read, but do not send anything through the forms.",
      ],
    },
    {
      h: "What the site is",
      p: [
        "A portfolio and a shop window. The work shown is work I have done. Prices, packages and turnaround times are described as accurately as I can manage, but they are an invitation to talk, not a binding offer. A price becomes binding when I quote it to you for your specific job and you accept it in writing, which includes WhatsApp or email.",
        "Nothing on this site takes a card number. Payment for anything is arranged directly, by the methods described on the page for that service.",
      ],
    },
    {
      h: "The free templates",
      p: [
        "The website templates are free, and free means free: no card, no trial that turns into a subscription, no obligation to hire me afterwards.",
        "When you download one you may use it for your own projects and for client work, modify it however you like, and keep using it forever. You may not resell the template itself as a template, or redistribute it as your own product.",
        "They come as they are. I have built and tested them, but a free template carries no warranty, no promise that it fits your purpose, and no support commitment. If something in one is broken, tell me and I will usually fix it, but that is goodwill rather than an obligation you have bought.",
      ],
    },
    {
      h: "Paid work",
      p: [
        "Scope, price and timing are agreed in writing before work starts. Timelines quoted on this site assume you supply what is needed when it is needed: text, photos, logins, approvals. Where those are late, the timeline moves by the same amount, and any deadline guarantee is measured from the day I have everything, which is why the guarantees on this site are worded that way.",
        "Payment terms are agreed per job. Where a service is monthly, it runs month to month unless the page for that service says otherwise, and the cancellation terms are set out in the Refund and Cancellation Policy.",
      ],
    },
    {
      h: "The guarantees",
      p: [
        "Several services on this site carry a specific guarantee: a site live within seven days or you do not pay, downtime beyond a day making that month free, results not beating an agreed baseline meaning I work the following months free. These are real and I intend to honour them. They are also conditional, and the conditions are part of the promise:",
      ],
      list: [
        "The baseline is written down and agreed by both of us before work starts. A guarantee measured against a number produced afterwards is not measurable, so no baseline means no guarantee.",
        "The guarantee assumes you do your part: supplying content and approvals, keeping the agreed access, and not making changes that undo the work.",
        "A guarantee paid in my continued work is exactly that. Unless the page for that service says a payment is refunded, the remedy is my time, not your money back.",
        "Guarantees do not cover things outside my control: a platform changing its rules, a hosting outage at the provider, your business closing or changing what it sells, or a third party taking your account down.",
      ],
      after: [
        "Where a page's wording and this section disagree about a specific service, the page for that service wins, because that is what you actually read when you bought it.",
      ],
    },
    {
      h: "What I own and what you own",
      p: [
        "The design, text, photographs and code of this site are mine, except for client work shown with permission, which belongs to those clients and is shown as a portfolio piece only. Do not copy the site or pass its contents off as your own.",
        "For work I do for you: on full payment, the finished deliverables become yours. Working files, source components and anything I built before your job and reused in it stay mine, licensed to you for the purpose it was made for. I keep the right to show the finished work in my portfolio unless we agree in writing that I will not.",
      ],
    },
    {
      h: "What you send me",
      p: [
        "When you send content for a job, you are telling me you have the right to use it. If you supply a photograph, a logo, a font or music you do not hold the rights to, I will use it in good faith on that basis, and the responsibility for that choice stays with you.",
        "Do not use the forms on this site to send anything unlawful, abusive or deliberately misleading, and do not use them to send bulk or automated messages.",
      ],
    },
    {
      h: "Limits",
      p: [
        "Nothing in these terms limits my liability for death or personal injury caused by negligence, for fraud, or for anything else the law does not allow to be limited. Where consumer protection law gives you rights, including under Lebanese Consumer Protection Law No. 659/2005, these terms do not take them away.",
        "Beyond that: I am not liable for indirect or consequential losses, for lost profits, or for loss of data. Where I am liable for a job, my liability is limited to what you paid me for that job.",
        "The site itself is provided as it is. I do not promise it will always be available or always free of errors.",
      ],
    },
    {
      h: "Links to other sites",
      p: [
        "This site links to other people's sites and embeds content from Instagram and Calendly. I do not control those and I am not responsible for what is on them or what they do with your data once you go there.",
      ],
    },
    {
      h: "Law",
      p: [
        `These terms are governed by the law of ${BUSINESS.country}, and the courts of ${BUSINESS.city} have jurisdiction. If you deal with me as a consumer somewhere with laws that give you the right to your own local courts, this does not remove that right.`,
      ],
    },
    {
      h: "Changes",
      p: [
        `Last updated ${LEGAL_UPDATED}. Terms may change, and the version that applies to a job is the one in force on the day it was agreed, not whatever is here later.`,
      ],
    },
  ],
};

/* =========================================================================
   REFUND AND CANCELLATION POLICY
   ========================================================================= */
export const REFUNDS = {
  slug: "refunds",
  title: "Refund and Cancellation Policy",
  lede:
    "When you get your money back, when you do not, and how to cancel. No small print games.",
  sections: [
    {
      h: "The free things",
      p: [
        "There is nothing to refund on the free templates, the brand teardown, the first reel or the free coaching hour. They cost nothing, so nothing is at risk, and you owe nothing afterwards.",
      ],
    },
    {
      h: "Monthly memberships and care plans",
      p: [
        "Monthly plans run month to month. Cancel any time and the plan runs to the end of the month you have paid for. Nothing is taken after that.",
        "Cancel a monthly membership within the first 30 days and that month is refunded in full. You keep anything you already downloaded. Cancel an annual membership within the first 30 days and the year is refunded in full, on the same terms.",
        `To cancel, email ${BUSINESS.email} or send a WhatsApp message to ${BUSINESS.phone}. One line is enough. There is no retention script and nobody will try to talk you out of it.`,
      ],
    },
    {
      h: "Longer-term programmes",
      p: [
        "Where a service is sold on a fixed term rather than month to month, the term, the total amount and what happens if you leave early are set out in writing before you pay, and the terms you agreed are the ones that apply. If a page on this site offers a term commitment without spelling those out, ask before paying, and do not pay until it is in writing.",
      ],
    },
    {
      h: "Project work",
      p: [
        "A deposit reserves your slot in the schedule and covers the work done from that point. Once work has started, the deposit is not refundable, because the time is gone and it was held for you rather than someone else.",
        "If you cancel partway through, you pay for the work done up to that point and I hand over what exists. If I cancel partway through, for any reason that is mine rather than yours, you are refunded for anything paid and not yet delivered.",
      ],
    },
    {
      h: "Where a guarantee applies instead",
      p: [
        "Several services carry a guarantee. Read it before assuming a refund: most of these are paid in my continued work rather than in returned money, and the Terms explain why. Where a page says you do not pay, you do not pay. Where a page says a month is refunded, it is refunded. Where it says I keep working free, that is the remedy.",
      ],
    },
    {
      h: "Your legal rights",
      p: [
        "This policy is in addition to your rights under consumer law, not instead of them. If a service is not delivered as described, consumer protection law gives you remedies regardless of what this page says, and Lebanese Consumer Protection Law No. 659/2005 applies to consumers in Lebanon.",
        "If you are a consumer in the EU or UK buying a digital product, you normally have 14 days to change your mind, except where you asked for delivery to start immediately and acknowledged you would lose that right, which is what taking an instant download means.",
      ],
    },
    {
      h: "How refunds are paid",
      p: [
        "A refund goes back by the same route the payment came in, within 14 days of it being agreed. Where that route cannot receive a refund, which happens with some local payment methods, we agree an alternative and I confirm it in writing before sending anything.",
      ],
    },
    {
      h: "If something goes wrong",
      p: [
        `Email ${BUSINESS.email} or message ${BUSINESS.phone} and tell me what happened. Most problems are a misunderstanding about scope, and most of those are fixed the same day. I would rather sort it out directly than have you take it anywhere else.`,
      ],
    },
    {
      h: "Changes",
      p: [`Last updated ${LEGAL_UPDATED}.`],
    },
  ],
};

export const LEGAL_PAGES = [PRIVACY, COOKIES, TERMS, REFUNDS];

/** Look up a policy by its slug. */
export const legalBySlug = (slug) => LEGAL_PAGES.find((d) => d.slug === slug);

/* ── The checklist ────────────────────────────────────────────────────────
 * Everything that must be real before these pages are published. Kept here
 * rather than in a README so it sits next to the thing it is about.
 */
export const LEGAL_TODO = [
  "BUSINESS.legalName: your full legal name, or the registered company name.",
  "BUSINESS.address: a full postal address for legal notices. A city is not enough.",
  "BUSINESS.registration: commercial register or VAT number, or delete the line if you are not registered.",
  "LEGAL_UPDATED: the date you actually publish.",
  "Confirm the 24-month retention matches RETENTION_TTL in worker/index.js.",
  "Lebanese Law 81/2018: check whether your processing needs a licence or declaration to the Ministry of Economy and Trade.",
  "If you ever add a card processor, the Refund policy needs its chargeback and dispute terms.",
];
