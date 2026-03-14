
import "../../styles/main.scss";

export const Main = (child: { children: React.ReactNode }) => {
    return (
        <main>
            {child.children}
        </main>
    );
}