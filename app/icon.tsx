import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          borderRadius: 16,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V7L14 2Z"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 2V7H19"
            stroke="#111827"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9 11H15"
            stroke="#2563eb"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9 15H15"
            stroke="#2563eb"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
