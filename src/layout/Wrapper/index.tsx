
import "../../styles/wrapper.scss";

export const Wrapper = (child: { children: React.ReactNode }) => {
    return (
        <div className="wrapper">
            {child.children}
        </div>
    );
}