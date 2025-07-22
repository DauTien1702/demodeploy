import "./LayoutPage.css";

export default function LayoutAdmin({ children }) {
  return (
    <div className="layout_background_admin">
      <div className="layout_content_admin">{children}</div>
    </div>
  );
}
