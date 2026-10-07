function preventImageAction(event) {
  event.preventDefault();
}

function ProtectedImage({ style, ...props }) {
  return (
    <img
      {...props}
      draggable={false}
      onContextMenu={preventImageAction}
      onDragStart={preventImageAction}
      style={{
        ...style,
        WebkitUserDrag: "none",
        WebkitTouchCallout: "none",
        userSelect: "none",
      }}
    />
  );
}

export default ProtectedImage;
