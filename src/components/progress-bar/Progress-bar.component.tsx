type ProgressBarProps = {
  uploadProgress: number;
};

export function ProgressBar({ uploadProgress }: ProgressBarProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          width: "320px",
          marginTop: "10px",
          height: "20px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#00cc66",
            width: `${uploadProgress}%`,
            borderRadius: "10px",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
