export function checkinDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function checkinStorageKey(userId: string) {
  return `beautyai.photoCheckin.${userId}.${checkinDateKey()}`;
}

export type CheckinReport = {
  date: string;
  submittedAt: string;
  photos: { name: string; url: string }[];
};

export function readCheckinReport(userId: string): CheckinReport | null {
  try {
    const report = JSON.parse(sessionStorage.getItem(`beautyai.checkinReport.${userId}`) ?? "null");
    if (report?.date !== checkinDateKey() || typeof report.submittedAt !== "string" ||
        !Array.isArray(report.photos) || report.photos.length !== 2 ||
        !report.photos.every((photo: { name?: unknown; url?: unknown }) =>
          typeof photo.name === "string" && typeof photo.url === "string" && photo.url.startsWith("data:image/jpeg"))) return null;
    return report;
  } catch {
    return null;
  }
}

// Persist small previews, since upload object URLs are released on route change.
export function createCheckinPreview(photo: { name: string; url: string }): Promise<{ name: string; url: string }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error("图片无法读取，请重新拍摄。"));
    image.onload = () => {
      try {
        const ratio = Math.min(1, 640 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("无法生成照片预览，请重试。");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve({ name: photo.name, url: canvas.toDataURL("image/jpeg", 0.8) });
      } catch (error) {
        reject(error);
      }
    };
    image.src = photo.url;
  });
}
