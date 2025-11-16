import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

const Footer = () => {
    return (
        <div className="container max-w-6xl mx-auto p-5 md:p-3 py-3">
            <div className="flex justify-between">
                <div className="text-muted-foreground mt-8 text-sm">Nav</div>
                <div><LocaleSwitcher /></div>
            </div>
            <div className="flex justify-between">
                <div className="text-muted-foreground mt-8 text-sm">© 2025 EventZ.</div>
            </div>
        </div>
    );
};

export default Footer;