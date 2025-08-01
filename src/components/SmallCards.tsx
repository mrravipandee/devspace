import { ArrowUpLeftSquare, CalendarDays, Users, FileText, LayoutGrid } from "lucide-react";

export default function SmallCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {menuItems.map(({ title, description, icon: Icon, showDate }, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col h-full border border-gray-100 hover:border-gray-200 group"
                >
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-3">
                            <div className={`rounded-lg h-10 w-10 flex-shrink-0 flex items-center justify-center ${getIconBgColor(title)} group-hover:opacity-90 transition-opacity`}>
                                <Icon className={`${getIconColor(title)} h-5 w-5`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    {title}
                                </h3>
                                <p className="text-base font-semibold text-gray-800 leading-tight">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {showDate && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-flex items-center">
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
        'Visitors': 'bg-purple-100',
        'Projects': 'bg-blue-100',
        'Blog and Articles': 'bg-green-100',
        'Fourth Card': 'bg-orange-100'
    };
    return colors[title] || 'bg-gray-100';
}

function getIconColor(title: string) {
    const colors: Record<string, string> = {
        'Visitors': 'text-purple-600',
        'Projects': 'text-blue-600',
        'Blog and Articles': 'text-green-600',
        'Fourth Card': 'text-orange-600'
    };
    return colors[title] || 'text-gray-600';
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