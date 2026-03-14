
import "../../styles/content.scss";

export const Content = (child: { children: React.ReactNode }) => {
    return (
        <div className="content-container">
            {child.children}
        </div>
    );
}