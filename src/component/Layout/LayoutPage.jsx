import "./LayoutPage.css";

export default function LayoutPage({ children }) {
  return (
    <div className="layout_background">
      <div className="layout_content">{children}</div>
    </div>
  );
}
