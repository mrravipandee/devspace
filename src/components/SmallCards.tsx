import { ArrowUpLeftSquare, CalendarDays, Users, FileText, LayoutGrid } from "lucide-react";

export default function SmallCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {menuItems.map(({ title, description, icon: Icon, showDate }, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-cardDark rounded-xl p-4 cursor-pointer flex flex-col h-full group transition-colors duration-200"
                >
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-3">
                            <div className={`rounded-lg h-10 w-10 flex-shrink-0 flex items-center justify-center ${getIconBgColor(title)} dark:bg-opacity-20 group-hover:opacity-90 transition-opacity`}>
                                <Icon className={`${getIconColor(title)} dark:text-opacity-80 h-5 w-5`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider mb-1">
                                    {title}
                                </h3>
                                <p className="text-base font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {showDate && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full inline-flex items-center">
                                <CalendarDays className="h-3 w-3 mr-1.5" />
                                {new Date().toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Helper functions for dynamic styling
function getIconBgColor(title: string) {
    const colors: Record<string, string> = {
        'Visitors': 'bg-[#F4F7FE]',
        'Projects': 'bg-[#F4F7FE]',
        'Blog and Articles': 'bg-[#F4F7FE]',
        'Fourth Card': 'bg-[#F4F7FE]'
    };
    return colors[title] || 'bg-[#F4F7FE]';
}

function getIconColor(title: string) {
    const colors: Record<string, string> = {
        'Visitors': 'text-primary dark:text-white',
        'Projects': 'text-primary dark:text-white',
        'Blog and Articles': 'text-primary dark:text-white',
        'Fourth Card': 'text-primary dark:text-white'
    };
    return colors[title] || 'text-primary dark:text-white';
}

const menuItems = [
    {
        title: "Visitors",
        description: "1,240",
        icon: Users,
        showDate: false
    },
    {
        title: "Projects",
        description: "12 Active",
        icon: LayoutGrid,
        showDate: true
    },
    {
        title: "Blog and Articles",
        description: "24 Published",
        icon: FileText,
        showDate: true
    },
    {
        title: "Engagement",
        description: "78% Increase",
        icon: ArrowUpLeftSquare,
        showDate: false
    },
];