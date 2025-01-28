import { Auth } from "./component/UserAuth";
import { PublicLayout } from "./PrimaryLayout";
export default function BasicTabs() {
    return (
        <PublicLayout>
            <Auth />
        </PublicLayout>
    );
}
