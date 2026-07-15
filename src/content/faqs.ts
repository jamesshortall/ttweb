import type { Faq } from "@/lib/cms/types";

/** General site/services FAQs — editable in Sanity (faq documents, group "general"). */
export const fallbackGeneralFaqs: Faq[] = [
  {
    question: "Is Travel Technician a travel agency?",
    answer:
      "No. Travel Technician is an independent education and consulting service focused on points, miles, and loyalty programs. It does not book flights, hotels, or any other travel, and it is not affiliated with any airline, hotel company, bank, credit card issuer, loyalty program, or travel agency.",
  },
  {
    question: "Do I need a lot of points to get value from a consultation?",
    answer:
      "No. Many clients are just starting out, and some of the most useful sessions happen before you've earned a single point — when the right early decisions matter most. If you already have points, a consultation helps you use them well instead of letting them sit or expire.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. Everything Travel Technician provides is educational. Credit card discussions cover how rewards, benefits, and fees work so you can make your own informed decisions. Nothing on this site or in a session is financial, legal, tax, or investment advice, and card approvals are decided solely by issuers.",
  },
  {
    question: "How much do services cost?",
    answer:
      "The initial consultation is free, and paid engagements are scoped to what you actually need — from a single strategy session to a full points portfolio audit. Contact Jim for details and current rates.",
  },
  {
    question: "Can you guarantee a specific redemption, like QSuites?",
    answer:
      "No — and you should be skeptical of anyone who says otherwise. Award availability changes constantly. What a good strategy does is put you in position: the right points, in the right programs, with realistic expectations and backup plans.",
  },
  {
    question: "What is CardMaster and does it cost anything?",
    answer:
      "CardMaster is Travel Technician's free web application for tracking points balances, credit card benefits, statement credits, annual fees, and expiration dates — for you and your household. It's free to use; new accounts require a quick approval step.",
  },
];

/** CardMaster page FAQs — editable in Sanity (faq documents, group "cardmaster"). */
export const fallbackCardMasterFaqs: Faq[] = [
  {
    question: "Is CardMaster really free?",
    answer:
      "Yes. CardMaster is free to use. It exists because Jim built the tool he needed to manage his own points and cards, and opening it up helps more people stay organized.",
  },
  {
    question: "Why do new accounts need approval?",
    answer:
      "Approval keeps the platform limited to real people and lets support stay personal while CardMaster grows. After you register, your account is reviewed and you'll receive access — typically within a day or two.",
  },
  {
    question: "Does CardMaster connect to my bank or credit card accounts?",
    answer:
      "No. CardMaster does not link to your financial accounts and never asks for banking credentials or card numbers. You enter and update the balances, benefits, and fees you want to track — you stay in control of your data.",
  },
  {
    question: "Can I track cards and points for my whole household?",
    answer:
      "Yes. CardMaster is built for households: you can manage cards and loyalty balances for multiple family members in one place, which is where most families' points strategies fall apart when tracked in spreadsheets.",
  },
  {
    question: "What reminders does CardMaster send?",
    answer:
      "CardMaster can remind you before points or miles expire and helps you keep an eye on annual fee dates and unused statement credits, so benefits you're paying for don't quietly go to waste.",
  },
  {
    question: "Is CardMaster connected to this website's data?",
    answer:
      "No. CardMaster is a separate application at cardmaster.traveltechnician.info with its own accounts. Nothing you do on this website is connected to CardMaster user data.",
  },
];
