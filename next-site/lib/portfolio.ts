import history from "./publication-history.json";

// Source links are the authority for titles, authors, venues, and release dates.
// Reviewed 2026-09-05. Earlier records were carried over from docs/index.html.
export const updated = "September 2026";
export const scholar = "https://scholar.google.com/citations?user=1_zc1-IAAAAJ";
export const projects = [
  {
    id: "onevision-2",
    name: "LLaVA-OneVision-2",
    category: "Multimodal models",
    mark: "OV.2",
    description:
      "Video, spatial grounding, and motion understanding in one open model. Codec-stream tokenization puts visual tokens where the action is.",
    href: "https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-2",
    paper: "https://arxiv.org/abs/2605.25979",
    note: "2026 / Models, data & code",
  },
  {
    id: "encoder",
    name: "OneVision-Encoder",
    category: "Visual representations",
    mark: "OV.E",
    description:
      "A vision encoder that takes its cues from video compression, focusing computation on informative patches across space and time.",
    href: "https://github.com/EvolvingLMMs-Lab/OneVision-Encoder",
    paper: "https://arxiv.org/abs/2602.08683",
    note: "2026 / Models & code",
  },
  {
    id: "eval",
    name: "LMMs-Eval",
    category: "Evaluation",
    mark: "EVAL",
    description:
      "Reproducible evaluation across text, image, video, and audio. With an HTTP evaluation service, statistical comparisons, and agentic tasks.",
    href: "https://github.com/EvolvingLMMs-Lab/lmms-eval",
    paper: "",
    note: "Open source / Evaluation toolkit",
  },
  {
    id: "engine",
    name: "LMMs-Engine",
    category: "Training infrastructure",
    mark: "ENG",
    description:
      "A shared training engine for multimodal understanding and generation, with distributed training recipes for vision-language and video models.",
    href: "https://github.com/EvolvingLMMs-Lab/lmms-engine",
    paper: "",
    note: "Open source / Training engine",
  },
  {
    id: "onevision-15",
    name: "LLaVA-OneVision-1.5",
    category: "Multimodal models",
    mark: "OV.1",
    description:
      "An open recipe for multimodal training from scratch: curated data, model checkpoints, training code, and reinforcement learning post-training.",
    href: "https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-1.5",
    paper: "https://arxiv.org/abs/2509.23661",
    note: "2025 / Models, data & code",
  },
  {
    id: "sae",
    name: "Multimodal-SAE",
    category: "Interpretability",
    mark: "SAE",
    description:
      "Sparse autoencoders for investigating the internal representations of multimodal models.",
    href: "https://github.com/EvolvingLMMs-Lab/multimodal-sae",
    paper: "",
    note: "Open source / Interpretability",
  },
  {
    id: "aero",
    name: "Aero-1-Audio",
    category: "Audio models",
    mark: "AERO",
    description:
      "Open audio models for speech and sound understanding, with a focus on data-efficient training.",
    href: "https://www.lmms-lab.com/posts/aero_audio/",
    paper: "",
    note: "2025 / Technical report",
  },
  {
    id: "next",
    name: "LLaVA-NeXT",
    category: "Multimodal models",
    mark: "NEXT",
    description:
      "Open multimodal models with improved visual reasoning, OCR, and world knowledge.",
    href: "https://github.com/LLaVA-VL/LLaVA-NeXT",
    paper: "https://llava-vl.github.io/blog/2024-01-30-llava-next/",
    note: "2024 / Models & code",
  },
];

export type Publication = {
  id: string;
  title: string;
  venue: string;
  authors: string;
  href: string;
  code?: string;
  description?: string;
};
export const publications: Publication[] = [
  {
    id: "mmsearch-r1",
    title: "MMSearch-R1: Incentivizing LMMs to Search",
    venue: "ACL 2026",
    authors:
      "Jinming Wu, Zihao Deng, Wei Li, Yiding Liu, Bo You, Bo Li, Zejun Ma, Ziwei Liu",
    href: "https://aclanthology.org/2026.acl-long.114/",
    description:
      "Learning when and how to search for external knowledge during multimodal reasoning.",
  },
  {
    id: "longvt",
    title:
      "LongVT: Incentivizing “Thinking with Long Videos” via Native Tool Calling",
    venue: "CVPR 2026",
    authors:
      "Zuhao Yang, Sudong Wang, Kaichen Zhang, Keming Wu, Sicong Leng, Yifan Zhang, Bo Li, Chengwei Qin, Shijian Lu, Xingxuan Li, Lidong Bing",
    href: "https://openaccess.thecvf.com/content/CVPR2026/html/Yang_LongVT_Incentivizing_Thinking_with_Long_Videos_via_Native_Tool_Calling_CVPR_2026_paper.html",
    description:
      "Video reasoning that revisits relevant clips through native tool calls.",
  },
  {
    id: "onevision-2",
    title: "LLaVA-OneVision-2: Towards Next-Generation Perceptual Intelligence",
    venue: "arXiv 2026",
    authors:
      "Xiang An, Yin Xie, Feilong Tang, Yunyao Yan, Huajie Tan, Didi Zhu, Changrui Chen, Xiuwei Zhao, Bin Qin, Kaicheng Yang, Yifei Shen, Yuanhan Zhang, Kaichen Zhang, Wenkang Zhang, Zheng Cheng, Nansen Zhang, Chunsheng Wu, Chunjiang Ge, Zimin Ran, Dehua Song, Chunyuan Li, Shikun Feng, Ming Hu, Zhangquan Chen, Junbo Niu, Bo Li, Ziyong Feng, Ziwei Liu, Zongyuan Ge, Jiankang Deng",
    href: projects[0].paper,
    code: projects[0].href,
    description:
      "Codec-stream tokenization for video understanding, temporal and spatial grounding, and manipulation-trace reasoning.",
  },
  {
    id: "encoder",
    title:
      "OneVision-Encoder: Codec-Aligned Sparsity as a Foundational Principle for Multimodal Intelligence",
    venue: "arXiv 2026",
    authors:
      "Feilong Tang, Xiang An, Yunyao Yan, Yin Xie, Bin Qin, Kaicheng Yang, Yifei Shen, Yuanhan Zhang, Chunyuan Li, Shikun Feng, Changrui Chen, Huajie Tan, Ming Hu, Manyuan Zhang, Bo Li, Ziyong Feng, Ziwei Liu, Zongyuan Ge, Jiankang Deng",
    href: projects[1].paper,
    code: projects[1].href,
    description:
      "Learning visual representations from sparse, informative video patches with shared spatial and temporal coordinates.",
  },
  {
    id: "onevision-15",
    title:
      "LLaVA-OneVision-1.5: Fully Open Framework for Democratized Multimodal Training",
    venue: "arXiv 2025",
    authors:
      "Xiang An, Yin Xie, Kaicheng Yang, Wenkang Zhang, Xiuwei Zhao, Zheng Cheng, Yirui Wang, Songcen Xu, Changrui Chen, Didi Zhu, Chunsheng Wu, Huajie Tan, Chunyuan Li, Jing Yang, Jie Yu, Xiyao Wang, Bin Qin, Yumeng Wang, Zizhen Yan, Ziyong Feng, Ziwei Liu, Bo Li, Jiankang Deng",
    href: projects[4].paper,
    code: projects[4].href,
    description:
      "A reproducible framework for training open vision-language models, including data curation and reinforcement learning post-training.",
  },
  ...history.map((paper) =>
    paper.id === "li2024llava"
      ? {
          ...paper,
          authors:
            "Bo Li, Yuanhan Zhang, Dong Guo, Renrui Zhang, Feng Li, Hao Zhang, Kaichen Zhang, Peiyuan Zhang, Yanwei Li, Ziwei Liu, Chunyuan Li",
        }
      : paper,
  ),
];

export const updates = [
  {
    date: "2026-07",
    label: "Jul 2026",
    title: "MMSearch-R1 at ACL",
    text: "Teaching multimodal models to seek external knowledge.",
    href: publications[0].href,
  },
  {
    date: "2026-06",
    label: "Jun 2026",
    title: "LongVT at CVPR",
    text: "Thinking with long videos through native tool calling.",
    href: publications[1].href,
  },
  {
    date: "2026-05-25",
    label: "May 2026",
    title: "LLaVA-OneVision-2",
    text: "Our latest report on video and spatial perception.",
    href: projects[0].paper,
  },
];

export const experience = [
  {
    date: "Present",
    name: "Advanced Machine Intelligence",
    place: "Member of Technical Staff",
    text: "Research on multimodal models and artificial intelligence systems.",
    href: "https://amilabs.xyz/",
  },
  {
    date: "Aug 2025 - Feb 2026",
    name: "ByteDance Seed",
    place: "Singapore",
    text: "TopSeed program, Multimodal & World Model team. Worked on unified multimodal models with Haoqi Fan.",
    href: "https://team.doubao.com/en/",
  },
  {
    date: "Oct 2024 - Aug 2025",
    name: "TikTok AI Innovation Center",
    place: "Singapore",
    text: "With Wei Li and Zejun Ma.",
    href: "https://lifeattiktok.com/",
  },
  {
    date: "Dec 2023 - Aug 2024",
    name: "ByteDance Seed",
    place: "Singapore",
    text: "Built open multimodal models with Chunyuan Li.",
    href: "https://team.doubao.com/en/",
  },
  {
    date: "Dec 2022 - Aug 2023",
    name: "Microsoft Research",
    place: "Redmond",
    text: "With Chunyuan Li. Collaborated with Haotian Liu on LLaVA.",
    href: "https://www.microsoft.com/en-us/research/lab/microsoft-research-redmond/",
  },
  {
    date: "Sep 2020 - Dec 2021",
    name: "Microsoft Research",
    place: "Shanghai",
    text: "With Dongsheng Li.",
    href: "https://www.microsoft.com/en-us/research/",
  },
  {
    date: "Oct 2019 - Aug 2020",
    name: "Berkeley AI Research",
    place: "Berkeley",
    text: "With Kurt Keutzer, Sicheng Zhao, Xiangyu Yue, Shanghang Zhang, and Colorado Reed.",
    href: "https://bair.berkeley.edu/",
  },
  {
    date: "May 2018 - Oct 2019",
    name: "DiDi",
    place: "Beijing",
    text: "Visual Perception Team.",
    href: "https://www.didiglobal.com/",
  },
];
