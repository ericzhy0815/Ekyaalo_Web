const cases = [
  {
    id: 1,
    title: "Case #1",
    date: "2025-03-01",
    status: "Open",
    reviewed: false,
    patient: { name: "John Doe", age: 45, gender: "Male" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Benign",
        comments: [
          {
            pathologist: "Dr. Adams",
            text: "Looks like a benign lesion.",
            timestamp: "2025-03-01T09:15:00Z",
          },
          {
            pathologist: "Dr. Lee",
            text: "Agree, no signs of malignancy here.",
            timestamp: "2025-03-01T10:30:00Z",
          },
        ],
      },
      {
        id: 2,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Malign",
        comments: [],
      },
    ],
    diagnosis: null,
  },
  {
    id: 2,
    title: "Case #2",
    date: "2025-02-28",
    status: "Closed",
    reviewed: true,
    patient: { name: "Jane Smith", age: 32, gender: "Female" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Benign",
        comments: [
          {
            pathologist: "Dr. Smith",
            text: "Looks normal, no concerns.",
            timestamp: "2025-02-28T10:00:00Z",
          },
          {
            pathologist: "Dr. Patel",
            text: "Confirmed, benign features only.",
            timestamp: "2025-02-28T11:20:00Z",
          },
        ],
      },
    ],
    diagnosis: "Benign",
  },
  {
    id: 3,
    title: "Case #3",
    date: "2025-02-27",
    status: "Pending",
    reviewed: false,
    patient: { name: "Bob Johnson", age: 60, gender: "Male" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Malign",
        comments: [
          {
            pathologist: "Dr. Garcia",
            text: "Highly suspicious for malignancy.",
            timestamp: "2025-02-27T14:45:00Z",
          },
        ],
      },
    ],
    diagnosis: null,
  },
  {
    id: 4,
    title: "Case #4",
    date: "2025-02-26",
    status: "Open",
    reviewed: false,
    patient: { name: "Alice Brown", age: 28, gender: "Female" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Suspicious",
        comments: [
          {
            pathologist: "Dr. Kim",
            text: "Unclear margins, needs further review.",
            timestamp: "2025-02-26T08:10:00Z",
          },
          {
            pathologist: "Dr. Nguyen",
            text: "Could be benign, but I’d biopsy again.",
            timestamp: "2025-02-26T09:25:00Z",
          },
        ],
      },
    ],
    diagnosis: null,
  },
  {
    id: 5,
    title: "Case #5",
    date: "2025-02-25",
    status: "Closed",
    reviewed: true,
    patient: { name: "Mark Wilson", age: 55, gender: "Male" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Benign",
        comments: [
          {
            pathologist: "Dr. Taylor",
            text: "Typical benign characteristics.",
            timestamp: "2025-02-25T13:00:00Z",
          },
        ],
      },
    ],
    diagnosis: "Benign",
  },
  {
    id: 6,
    title: "Case #6",
    date: "2025-02-24",
    status: "Pending",
    reviewed: false,
    patient: { name: "Emily Davis", age: 39, gender: "Female" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Malign",
        comments: [
          {
            pathologist: "Dr. Chen",
            text: "Clear signs of malignancy.",
            timestamp: "2025-02-24T15:30:00Z",
          },
          {
            pathologist: "Dr. Patel",
            text: "Agree, aggressive features present.",
            timestamp: "2025-02-24T16:45:00Z",
          },
        ],
      },
      {
        id: 2,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Suspicious",
        comments: [],
      },
    ],
    diagnosis: null,
  },
  {
    id: 7,
    title: "Case #7",
    date: "2025-02-23",
    status: "Open",
    reviewed: false,
    patient: { name: "Tom Lee", age: 50, gender: "Male" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Benign",
        comments: [
          {
            pathologist: "Dr. Adams",
            text: "Likely benign, but monitor.",
            timestamp: "2025-02-23T11:00:00Z",
          },
        ],
      },
    ],
    diagnosis: null,
  },
  {
    id: 8,
    title: "Case #8",
    date: "2025-02-22",
    status: "Closed",
    reviewed: true,
    patient: { name: "Sarah Clark", age: 27, gender: "Female" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Malign",
        comments: [
          {
            pathologist: "Dr. Garcia",
            text: "Malignant, urgent follow-up needed.",
            timestamp: "2025-02-22T09:45:00Z",
          },
          {
            pathologist: "Dr. Kim",
            text: "Confirmed, aggressive growth.",
            timestamp: "2025-02-22T10:15:00Z",
          },
        ],
      },
    ],
    diagnosis: "Malign",
  },
  {
    id: 9,
    title: "Case #9",
    date: "2025-02-21",
    status: "Pending",
    reviewed: false,
    patient: { name: "David Miller", age: 63, gender: "Male" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Suspicious",
        comments: [
          {
            pathologist: "Dr. Nguyen",
            text: "Uncertain, needs second opinion.",
            timestamp: "2025-02-21T12:30:00Z",
          },
          {
            pathologist: "Dr. Taylor",
            text: "Could be early malignancy.",
            timestamp: "2025-02-21T13:00:00Z",
          },
        ],
      },
    ],
    diagnosis: null,
  },
  {
    id: 10,
    title: "Case #10",
    date: "2025-02-20",
    status: "Open",
    reviewed: false,
    patient: { name: "Lisa White", age: 34, gender: "Female" },
    images: [
      {
        id: 1,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Benign",
        comments: [
          {
            pathologist: "Dr. Chen",
            text: "Benign, no action required.",
            timestamp: "2025-02-20T14:20:00Z",
          },
        ],
      },
      {
        id: 2,
        url: "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        tag: "Benign",
        comments: [
          {
            pathologist: "Dr. Lee",
            text: "Consistent with benign findings.",
            timestamp: "2025-02-20T15:00:00Z",
          },
          {
            pathologist: "Dr. Smith",
            text: "No abnormalities detected.",
            timestamp: "2025-02-20T15:30:00Z",
          },
        ],
      },
    ],
    diagnosis: null,
  },
];

export default cases;
