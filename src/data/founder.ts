export interface EducationItem {
  degree: string;
  institution?: string;
}

export interface FounderData {
  name: string;
  role: string;
  tagline: string;
  motto: string;
  scriptureRef: string;
  bio: string[];
  education: EducationItem[];
  leadership: string[];
  academicResearch: {
    overview: string;
    keyVenues: string[];
    focus: string;
  };
  ministryHighlights: string[];
  vision: string;
}

export const founderData: FounderData = {
  name: "Rev. David Anil Kumar Jeldi",
  role: "Founder & Director",
  tagline: "Pastor | Educator | Researcher | Church Historian",
  motto: "Equipping Saints for His Ministry",
  scriptureRef: "Ephesians 4:12",
  bio: [
    "Rev. David Anil Kumar Jeldi is the Founder and Director of the Institute of Christian Studies and Research, Vijayawada, Andhra Pradesh, India. He is a pastor, Bible teacher, researcher, and Christian educator committed to equipping believers for biblical ministry, academic excellence, and societal transformation.",
    "With over two decades of ministry experience, he has devoted his life to theological education, church leadership development, evangelism, and community service. His vision is to establish a Christ-centered institution that prepares faithful leaders through sound biblical scholarship, practical ministry training, and servant leadership.",
    "He is married to Jeldi Divya, and they are blessed with two sons: Jeldi David Samuel Finny, who is pursuing his final year of a Bachelor of Technology in Artificial Intelligence and Machine Learning, and Jeldi David Isaac Mathews, who is pursuing his final year of a Diploma in Artificial Intelligence and Machine Learning Engineering. The entire family is actively involved in Christian ministry.",
  ],
  education: [
    {
      degree: "Ph.D. Scholar in Christian Studies",
      institution: "SHUATS, Prayagraj",
    },
    {
      degree: "M.A. in Christian Studies",
      institution: "SHUATS, Prayagraj",
    },
    {
      degree: "B.A. in Christian Studies",
    },
    {
      degree: "Bachelor of Divinity",
      institution: "Bible League International",
    },
    {
      degree: "Diploma in Mechanical Engineering",
    },
  ],
  leadership: [
    "Founder & Director, Institute of Christian Studies and Research, Vijayawada",
    "Founder Trustee, Bethesda Living Church Ministries and Charitable Trust",
    "Founder President, Education Development Empowerment and Transformation of Society",
    "Secretary, Southern India Branch, Church History Association of India (CHAI)",
  ],
  academicResearch: {
    overview:
      "Rev. David Anil Kumar Jeldi has presented research papers at national and international academic forums, including Princeton Theological Seminary's World Christianity Conference. His research focuses particularly on Christianity in the Telugu-speaking regions of India, and he has authored numerous scholarly papers in the fields of church history and Christian studies.",
    keyVenues: [
      "Princeton Theological Seminary's World Christianity Conference",
      "Church History Association of India (CHAI)",
      "National and International Academic Theological Forums",
    ],
    focus:
      "Christianity in Telugu-speaking regions, Indian Church History, and contextual theological training.",
  },
  ministryHighlights: [
    "Led hundreds of people to faith in Christ through evangelistic ministry.",
    "Baptized over fifty new believers.",
    "Conducted pastors' conferences to strengthen church leaders across Andhra Pradesh, Telangana, and Odisha.",
    "Conducted Expository Preaching Workshops and Train the Trainers seminars to equip pastors and ministry leaders for effective biblical teaching and leadership.",
    "Actively mentors and develops leaders committed to transforming society through biblical principles.",
    "Trained thousands of Sunday school teachers, youth leaders, and church leaders in discipleship and ministry.",
    "Since 2002, organizing Summer Bible Clubs every year for Telugu-speaking children across five states, reaching nearly 90,000 children and youth.",
    "Preparing and mentoring committed “Bethesda Living Church Planters” who are equipped to establish and strengthen Christ-centered churches.",
    "Worked extensively with vulnerable children, helping reunite hundreds of runaway and street children with their families.",
    "Developed theological curricula and teaching materials for Bible colleges and seminaries.",
    "Translated books on discipleship and leadership into Telugu.",
  ],
  vision:
    "Rev. David Anil Kumar Jeldi's passion is to equip men and women for God's ministry through biblically grounded education, character formation, and practical ministry training. He believes that theological education should transform individuals, strengthen churches, and contribute to the holistic development of society.",
};
