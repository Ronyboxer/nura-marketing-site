export type Memory = {
  id: string;
  text: string;
  keywords: string[];
};

export const memories: Memory[] = [
  {
    id: "granddaughter",
    text: "Your granddaughter is Sarah. She visits every Sunday.",
    keywords: ["granddaughter", "sarah", "grandchild", "visits", "sunday"],
  },
  {
    id: "home",
    text: "You live with your daughter Anne. You're safe at home.",
    keywords: ["live", "home", "house", "where", "anne", "daughter", "staying"],
  },
  {
    id: "husband",
    text: "Your husband David passed away in 2019. He loved the garden.",
    keywords: ["husband", "david", "married", "spouse", "passed", "died"],
  },
  {
    id: "tea",
    text: "Anne makes you tea in the afternoon, around three.",
    keywords: ["tea", "afternoon", "drink", "anne", "three", "makes"],
  },
  {
    id: "work",
    text: "You worked as a schoolteacher for thirty-one years.",
    keywords: ["work", "worked", "job", "teacher", "schoolteacher", "career"],
  },
  {
    id: "cat",
    text: "Your cat is called Biscuit. He sleeps on the blue chair.",
    keywords: ["cat", "biscuit", "pet", "animal", "chair"],
  },
  {
    id: "doctor",
    text: "Your doctor's name is Dr. Ellis. Anne takes you to every visit.",
    keywords: ["doctor", "ellis", "appointment", "gp"],
  },
  {
    id: "born",
    text: "You were born in Leeds, in 1944.",
    keywords: ["born", "birthday", "leeds", "from", "age"],
  },
  {
    id: "son",
    text: "Your son Michael calls on Wednesday evenings.",
    keywords: ["son", "michael", "calls", "phone", "wednesday"],
  },
  {
    id: "dinner",
    text: "Dinner is at six. Anne cooks, and you eat together.",
    keywords: ["dinner", "eat", "supper", "food", "six", "meal"],
  },
];

export const fallbackLine =
  "I'm not sure about that, but I'm right here with you.";
