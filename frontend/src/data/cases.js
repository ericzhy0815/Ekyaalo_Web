const cases = [
  {
    id: 1,
    title: "Case #1",
    date: "2025-03-01",
    status: "Pending",
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
            text: " Agree, no signs of malignancy here.",
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
    issues: [
      {
        id: 1,
        title: "Unclear Image Quality",
        description:
          "Image #2 is blurry, making it difficult to assess for malignancy. A rescan may be necessary to clarify the diagnosis.",
        status: "Open",
        createdBy: "Dr. Adams",
        createdAt: "2025-03-01T09:30:00Z",
        comments: [
          {
            author: "Dr. Adams",
            text: "Image #2 is blurry, making it hard to assess malignancy.",
            timestamp: "2025-03-01T09:30:00Z",
          },
          {
            author: "Dr. Lee",
            text: "Agreed, we should request a rescan.",
            timestamp: "2025-03-01T10:45:00Z",
          },
        ],
        imageLinks: [
          "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Case #2",
    date: "2025-02-28",
    status: "Reviewed",
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
    issues: [
      {
        id: 1,
        title: "Initial Suspicion Resolved",
        description:
          "Initially suspected an abnormality, but a second review confirmed benign characteristics. No further action required.",
        status: "Closed",
        createdBy: "Dr. Smith",
        createdAt: "2025-02-28T10:05:00Z",
        comments: [
          {
            author: "Dr. Smith",
            text: "Initially thought there might be an issue, but second look confirms benign.",
            timestamp: "2025-02-28T10:05:00Z",
          },
          {
            author: "Dr. Patel",
            text: "Closed after review.",
            timestamp: "2025-02-28T11:25:00Z",
          },
        ],
        imageLinks: [],
      },
    ],
  },
  {
    id: 3,
    title: "Case #3",
    date: "2025-02-27",
    status: "Issue",
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
    issues: [
      {
        id: 1,
        title: "Urgent Review Needed",
        description:
          "Image #1 shows features highly suspicious for malignancy. Immediate review and action are required.",
        status: "Open",
        createdBy: "Dr. Garcia",
        createdAt: "2025-02-27T14:50:00Z",
        comments: [
          {
            author: "Dr. Garcia",
            text: "This looks malignant, needs immediate attention.",
            timestamp: "2025-02-27T14:50:00Z",
          },
        ],
        imageLinks: [
          "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Case #4",
    date: "2025-02-26",
    status: "Pending",
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
    issues: [
      {
        id: 1,
        title: "Need Additional Biopsy",
        description:
          "Suspicious findings with unclear margins observed in Image #1. Recommend a repeat biopsy to confirm diagnosis.",
        status: "Open",
        createdBy: "Dr. Nguyen",
        createdAt: "2025-02-26T09:30:00Z",
        comments: [
          {
            author: "Dr. Nguyen",
            text: "Suspicious findings, recommending another biopsy.",
            timestamp: "2025-02-26T09:30:00Z",
          },
          {
            author: "Dr. Kim",
            text: "Agreed, current image isn’t conclusive.",
            timestamp: "2025-02-26T09:45:00Z",
          },
        ],
        imageLinks: [
          "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Case #5",
    date: "2025-02-25",
    status: "Reviewed",
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
    issues: [],
  },
  {
    id: 6,
    title: "Case #6",
    date: "2025-02-24",
    status: "Issue",
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
            text: " Agree, aggressive features present.",
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
    issues: [
      {
        id: 1,
        title: "Malignancy Confirmation",
        description:
          "Image #1 shows clear signs of malignancy with aggressive features. Image #2 is suspicious and may be related. Urgent confirmation and treatment planning are needed.",
        status: "Open",
        createdBy: "Dr. Chen",
        createdAt: "2025-02-24T15:35:00Z",
        comments: [
          {
            author: "Dr. Chen",
            text: "Image #1 shows malignancy, needs urgent action.",
            timestamp: "2025-02-24T15:35:00Z",
          },
          {
            author: "Dr. Patel",
            text: "Second image is suspicious, might be related.",
            timestamp: "2025-02-24T16:50:00Z",
          },
        ],
        imageLinks: [
          "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Case #7",
    date: "2025-02-23",
    status: "Pending",
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
    issues: [],
  },
  {
    id: 8,
    title: "Case #8",
    date: "2025-02-22",
    status: "Reviewed",
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
    issues: [
      {
        id: 1,
        title: "Treatment Plan Required",
        description:
          "Malignant findings confirmed in Image #1 with aggressive growth features. Treatment plan established and issue resolved.",
        status: "Closed",
        createdBy: "Dr. Garcia",
        createdAt: "2025-02-22T09:50:00Z",
        comments: [
          {
            author: "Dr. Garcia",
            text: "Malignant finding confirmed, needs treatment plan.",
            timestamp: "2025-02-22T09:50:00Z",
          },
          {
            author: "Dr. Kim",
            text: "Plan established, issue resolved.",
            timestamp: "2025-02-22T10:20:00Z",
          },
        ],
        imageLinks: [
          "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Case #9",
    date: "2025-02-21",
    status: "Issue",
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
    issues: [
      {
        id: 1,
        title: "Second Opinion Requested",
        description:
          "Suspicious findings in Image #1 are uncertain and could indicate early malignancy. A second pathologist’s opinion is needed for confirmation.",
        status: "Open",
        createdBy: "Dr. Nguyen",
        createdAt: "2025-02-21T12:35:00Z",
        comments: [
          {
            author: "Dr. Nguyen",
            text: "Suspicious findings, need another pathologist’s input.",
            timestamp: "2025-02-21T12:35:00Z",
          },
        ],
        imageLinks: [
          "https://images.ctfassets.net/4dmg3l1sxd6g/2x4l13Kvo11GoFQvfRBlBr/0e8373ce6f5e7d2f557d5461dd9dc9fe/top5-fine-needle-biopsy-Figure-4.png_-_en?fm=webp&q=75",
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Case #10",
    date: "2025-02-20",
    status: "Pending",
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
    issues: [],
  },
];

export default cases;
