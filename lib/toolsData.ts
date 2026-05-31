export type ToolData = {
  id: string;
  slug: string;
  icon: string;
  label: string;
  desc: string;
  color: string;
  tag: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  content: {
    h2: string;
    paragraphs: string[];
    faq: { q: string; a: string }[];
  };
};

export const toolsData: ToolData[] = [
  {
    id: "bg-remover",
    slug: "background-remover",
    icon: "🌫️",
    label: "Background Remover",
    desc: "AI-powered background removal",
    color: "#10b981",
    tag: "Magic",
    seo: {
      title: "Free AI Background Remover | Remove Image BG Online",
      description: "Remove the background from any image instantly using on-device AI. 100% private, free, and creates perfect transparent PNGs.",
      keywords: ["background remover", "remove background from image", "transparent background maker", "free AI background removal"],
    },
    content: {
      h2: "Remove Image Backgrounds Instantly with AI",
      paragraphs: [
        "Cutting out subjects from photos used to require complex photo editing software. Now, our AI Background Remover does it for you in seconds with pixel-perfect accuracy.",
        "The best part? It runs entirely on your device using an optimized ONNX machine learning model. This means your private photos are never uploaded to a cloud server, saving you bandwidth and guaranteeing complete privacy."
      ],
      faq: [
        { q: "How does the background removal work?", a: "We use a lightweight, pre-trained AI vision model that is downloaded and executed directly in your browser using WebGL/WebAssembly. It automatically detects the main subject and masks out everything else." },
        { q: "Why does it say 'Initializing AI' the first time?", a: "The first time you use the tool, your browser needs to download the AI model (a few megabytes). After that, it is cached and runs instantly for future images." },
        { q: "Can I download the result with a transparent background?", a: "Yes! The tool automatically outputs a high-quality PNG file with a perfectly transparent background." }
      ]
    }
  },
  {
    id: "audio-extractor",
    slug: "mp4-to-mp3",
    icon: "🎵",
    label: "MP4 to MP3",
    desc: "Extract audio from videos instantly",
    color: "#ef4444",
    tag: "New",
    seo: {
      title: "Free MP4 to MP3 Converter | Extract Audio from Video",
      description: "Convert MP4 videos to MP3 audio files directly in your browser. 100% free, no file uploads, perfectly secure and private.",
      keywords: ["mp4 to mp3", "extract audio from video", "video to audio converter", "free mp4 to mp3 converter online"],
    },
    content: {
      h2: "Extract High-Quality Audio from Videos",
      paragraphs: [
        "If you have a video file and just want to listen to the audio track (like a podcast, a lecture, or a music video), our MP4 to MP3 converter is the perfect tool.",
        "Unlike other services that require you to upload massive video files to their servers—which takes forever and compromises your privacy—our tool utilizes WebAssembly to run the industry-standard FFmpeg engine directly inside your browser. Your video never leaves your device!"
      ],
      faq: [
        { q: "Does the video upload to a server?", a: "No! The entire video processing happens locally on your computer or phone using WebAssembly. Your files are 100% private." },
        { q: "What is the quality of the extracted MP3?", a: "The tool extracts the audio track at a high-quality 192kbps MP3 format, preserving excellent sound fidelity." },
        { q: "Is there a file size limit?", a: "Because it runs in your browser, it depends on your device's memory. Generally, videos up to 500MB process flawlessly." }
      ]
    }
  },
  {
    id: "compress",
    slug: "image-compressor",
    icon: "🗜️",
    label: "Image Compressor",
    desc: "Reduce image file size without quality loss",
    color: "#6c63ff",
    tag: "Popular",
    seo: {
      title: "Free Image Compressor | Reduce JPG/PNG Size Online",
      description: "Compress images up to 80% without losing quality. Free browser-based image compressor for PNG, JPEG, and WEBP. No signup, 100% private.",
      keywords: ["image compressor", "compress image", "reduce image size", "compress png", "compress jpg", "free image compressor online"],
    },
    content: {
      h2: "How to Compress Images Online for Free",
      paragraphs: [
        "Reducing your image file size is critical for website performance, email attachments, and saving storage space. Our Free Image Compressor uses advanced lossless and lossy algorithms to reduce file sizes by up to 80% without any perceptible drop in quality.",
        "Unlike cloud-based tools that upload your private photos to external servers, PDFBucket's Image Compressor processes everything entirely inside your web browser. This means your files never leave your device, guaranteeing 100% privacy and lightning-fast compression speeds."
      ],
      faq: [
        { q: "Does compressing an image reduce its quality?", a: "With lossless compression, the quality remains exactly the same while the file size drops. With slight lossy compression, the quality difference is virtually undetectable to the human eye, but the file size reduction is massive." },
        { q: "What image formats can I compress?", a: "You can compress PNG, JPEG, JPG, and WEBP formats directly in your browser." },
        { q: "Is this image compressor really private?", a: "Yes. All processing happens locally on your device using WebAssembly and Javascript. Your files are never uploaded to any server." }
      ]
    }
  },
  {
    id: "resize",
    slug: "image-resizer",
    icon: "📐",
    label: "Image Resizer",
    desc: "Resize to any dimension or social preset",
    color: "#38bdf8",
    tag: "",
    seo: {
      title: "Free Image Resizer | Resize Photos Online Instantly",
      description: "Resize images to exact pixel dimensions instantly. Perfect for Instagram, Twitter, and website optimization. Free, private, and no signup required.",
      keywords: ["image resizer", "resize image", "change image dimensions", "resize photo online", "social media image resizer"],
    },
    content: {
      h2: "How to Resize Images to Exact Dimensions",
      paragraphs: [
        "Whether you need to resize a photo for an Instagram post, a YouTube thumbnail, or just want to shrink a massive camera photo to a web-friendly size, our Free Image Resizer makes it instant and easy.",
        "Simply upload your image, enter your desired width and height, and download the perfectly sized result. The tool uses high-quality Lanczos resampling to ensure your images stay sharp and clear even when drastically changing their dimensions."
      ],
      faq: [
        { q: "How do I resize an image for Instagram?", a: "Instagram recommends 1080x1080 for square posts, and 1080x1350 for portrait posts. Simply enter those dimensions into the tool and resize your image." },
        { q: "Does resizing an image stretch it?", a: "No, you can choose to maintain the aspect ratio (proportions) so your image doesn't look stretched or squished when resizing." },
        { q: "Can I resize multiple images?", a: "Currently, you can resize one image at a time, but because processing happens instantly in your browser, you can process dozens of images per minute." }
      ]
    }
  },
  {
    id: "convert",
    slug: "format-converter",
    icon: "🔄",
    label: "Format Converter",
    desc: "Convert between PNG, JPEG, WEBP instantly",
    color: "#a78bfa",
    tag: "",
    seo: {
      title: "PNG to JPEG Converter | Free WEBP Converter Online",
      description: "Convert PNG to JPEG, JPG to WEBP, and more in seconds. The fastest browser-based image format converter. Free, no file uploads, 100% secure.",
      keywords: ["jpg to png converter", "png to jpeg", "convert to webp", "image format converter", "free image converter online"],
    },
    content: {
      h2: "Fastest Browser-Based Image Format Converter",
      paragraphs: [
        "Need to convert a heavy PNG to a lightweight JPEG? Or want to upgrade your website images to the next-gen WEBP format for faster loading speeds? Our format converter handles it all.",
        "There is no need to install bulky software or risk your privacy with cloud converters. Just drop your file, select the output format, and the browser handles the conversion instantly."
      ],
      faq: [
        { q: "How do I convert PNG to JPEG?", a: "Upload your PNG file, select JPEG as the target format from the dropdown, and click Download. The conversion happens instantly in your browser." },
        { q: "Why should I convert images to WEBP?", a: "WEBP is a modern image format developed by Google that provides superior lossless and lossy compression. WEBP images are typically 25-34% smaller than comparable JPEGs." },
        { q: "Is it safe to convert confidential documents?", a: "Absolutely. Our converter operates entirely client-side. Your files never leave your device." }
      ]
    }
  },
  {
    id: "qr",
    slug: "qr-code-generator",
    icon: "📱",
    label: "QR Code Generator",
    desc: "Create custom QR codes for any URL or text",
    color: "#34d399",
    tag: "New",
    seo: {
      title: "Free QR Code Generator | Create QR Codes Online",
      description: "Generate static QR codes for links, text, and Wi-Fi instantly. Free, no signup, and the QR codes never expire.",
      keywords: ["qr code generator", "create qr code", "free qr code maker", "generate qr code from link", "qr code no expiration"],
    },
    content: {
      h2: "Create High-Quality QR Codes for Free",
      paragraphs: [
        "QR codes are essential for bridging the physical and digital worlds. Whether you need a QR code for a restaurant menu, a business card, or event flyers, our free QR code generator creates high-resolution codes instantly.",
        "Unlike many other services, the QR codes you generate here are 'static'—which means they are completely free forever, do not track your users, and will never expire."
      ],
      faq: [
        { q: "Do these QR codes expire?", a: "No. The QR codes generated by PDFBucket are static, meaning the data is directly encoded into the image itself. They will work forever as long as the destination link is active." },
        { q: "Can I generate a QR code for a Wi-Fi network?", a: "Yes! You can format your text as 'WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;' and generate a QR code that automatically connects users to your Wi-Fi when scanned." },
        { q: "Are there any scan limits?", a: "Zero limits. You can print the QR code on a million flyers, and it will scan perfectly every time without any fees." }
      ]
    }
  },
  {
    id: "ocr",
    slug: "text-extractor",
    icon: "📝",
    label: "Text Extractor (OCR)",
    desc: "Extract text from images and screenshots",
    color: "#f59e0b",
    tag: "",
    seo: {
      title: "Extract Text from Image | Free OCR Tool Online",
      description: "Instantly copy text from images, screenshots, and scanned documents. Free browser-based OCR tool. 100% private, no signup required.",
      keywords: ["extract text from image", "ocr online", "image to text converter", "copy text from screenshot", "free ocr tool"],
    },
    content: {
      h2: "Extract Text from Images and Screenshots (OCR)",
      paragraphs: [
        "Optical Character Recognition (OCR) technology allows you to convert images of typed, handwritten, or printed text into machine-encoded text. If you have a screenshot, a photo of a document, or a scanned PDF, our Text Extractor will digitize the text for you.",
        "We utilize state-of-the-art WebAssembly ports of the Tesseract OCR engine, meaning the heavy machine learning processing happens directly on your device CPU. No sensitive documents are ever transmitted over the internet."
      ],
      faq: [
        { q: "How accurate is the text extraction?", a: "For clear, high-contrast printed text (like screenshots of articles), the accuracy is typically 99% or higher. Poor lighting, blurry images, or complex handwriting will reduce accuracy." },
        { q: "Can I extract text from a scanned PDF?", a: "Yes. You can take a screenshot of the specific page or export it as an image, and then run it through our Text Extractor." },
        { q: "Is my document uploaded to a server?", a: "No. The entire OCR process runs in your browser. This makes it completely safe for confidential business documents and private information." }
      ]
    }
  },
  {
    id: "palette",
    slug: "color-palette",
    icon: "🎨",
    label: "Color Palette",
    desc: "Extract dominant colors from any image",
    color: "#f472b6",
    tag: "Fun",
    seo: {
      title: "Color Palette Generator | Extract Colors from Image",
      description: "Extract the dominant colors and hex codes from any image. Perfect free tool for designers and developers to build brand palettes.",
      keywords: ["color palette generator", "extract colors from image", "image color picker", "get hex code from image", "find dominant color"],
    },
    content: {
      h2: "Generate Stunning Color Palettes from Images",
      paragraphs: [
        "Finding the perfect color harmony is critical for design. Our Color Palette Generator analyzes any image you upload and mathematically determines the most dominant and visually striking colors present in the photo.",
        "This tool is incredibly useful for web developers, UI/UX designers, and digital artists who want to build a cohesive brand kit or theme based on reference photography. Click on any generated color to instantly copy its HEX code."
      ],
      faq: [
        { q: "How does the color extraction algorithm work?", a: "The tool utilizes color quantization (similar to the median-cut algorithm) to group millions of pixels into buckets based on color similarity, surfacing the most dominant visual clusters." },
        { q: "Can I copy the HEX codes?", a: "Yes, once the palette is generated, simply click on any color swatch to automatically copy the HEX code to your clipboard." },
        { q: "What types of images work best?", a: "High-resolution photos with clear distinct subjects and vibrant colors yield the most interesting palettes, but the tool works with any PNG, JPEG, or WEBP file." }
      ]
    }
  },
  {
    id: "handwriting",
    slug: "text-handwriting",
    icon: "✍️",
    label: "Text → Handwriting",
    desc: "Convert typed text to handwritten style",
    color: "#fb923c",
    tag: "Viral",
    seo: {
      title: "Text to Handwriting Converter | Free Online Tool",
      description: "Convert digital text into realistic handwriting images. Choose from different fonts and ink colors. Perfect for assignments and digital notes.",
      keywords: ["text to handwriting", "convert text to handwriting", "handwriting generator", "make typed text look handwritten", "realistic handwriting online"],
    },
    content: {
      h2: "Turn Digital Text into Realistic Handwriting",
      paragraphs: [
        "Want to add a personal touch to your digital notes, or need to submit an assignment that looks handwritten? Our Text to Handwriting converter takes your typed text and renders it onto a realistic paper background using natural-looking handwriting fonts.",
        "You can customize the ink color, font style, and paper type. Once you're satisfied with the preview, you can download the generated document as a high-quality image."
      ],
      faq: [
        { q: "Is the generated handwriting realistic?", a: "Yes, we use specially curated fonts that mimic natural pen strokes and slight variations in alignment to make it look as authentic as possible." },
        { q: "Can I change the ink color?", a: "Absolutely. You can select standard blue or black ink, or choose custom colors to match your style." },
        { q: "Can I download the result?", a: "Yes, you can instantly export the final handwritten page as an image file to your device." }
      ]
    }
  }
];

export const getToolBySlug = (slug: string) => {
  return toolsData.find(t => t.slug === slug);
};
