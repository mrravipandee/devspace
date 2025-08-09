import Image from "next/image";

export default function HowToUse() {
    return (
        <div className="bg-white dark:bg-cardDark p-4 md:p-8 rounded-xl w-full max-w-[80rem] mx-auto my-6">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText dark:text-background mb-3 flex items-center gap-2">
                    Transform Your Static Portfolio to Dynamic
                </h2>
                <p className="text-secondaryText text-sm sm:text-base">
                    Easily convert your static portfolio website into a dynamic one without backend setup. Just make API calls to fetch and display your content.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-background dark:bg-[#1B254B] rounded-lg ">
                    <div className="flex-shrink-0 w-10 h-10 border-2 border-primaryText dark:bg-cardDark dark:border-2 rounded-full flex items-center justify-center">
                        <span className="text-primaryText dark:text-background font-bold ">1</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-primaryText dark:text-background mb-2">Authenticate with DevSpace</h3>
                        <p className="text-gray-600 text-sm dark:text-secondaryText">
                            Use your DevSpace credentials to access the dashboard. DevSpace provides the infrastructure to manage your portfolio content, blogs, and articles in one place.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-background dark:bg-[#1B254B] rounded-lg ">
                    <div className="flex-shrink-0 w-10 h-10 border-2 border-primaryText dark:bg-cardDark rounded-full flex items-center justify-center">
                        <span className="text-primaryText dark:text-background font-bold">2</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-primaryText dark:text-background mb-2">Get Your API Endpoint</h3>
                        <p className="text-gray-600 text-sm dark:text-secondaryText">
                            Generate a unique API URL from your dashboard. This endpoint will serve all your portfolio data in JSON format, ready to be consumed by your static website.
                        </p>
                        <div className="mt-3 p-3 border-2 border-primaryText/70  dark:bg-cardDark rounded-md text-xs font-mono text-primaryText dark:text-background overflow-x-auto">
                            https://api.devspace.me/v1/username/data
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-background dark:bg-[#1B254B] rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 border-2 border-primaryText dark:bg-cardDark rounded-full flex items-center justify-center">
                        <span className="text-primaryText dark:text-background font-bold">3</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-primaryText dark:text-background mb-2">Integrate with Your Portfolio</h3>
                        <p className="text-gray-600 dark:text-secondaryText text-sm">
                            Add this simple fetch code to your static site to make it dynamic. No backend required - just pure frontend API calls.
                        </p>
                        <Image src={"/how-to-use-devspace-api-call.png"} alt="API Integration Example" width={600} height={400} className="mt-3 rounded-md shadow-sm" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-background dark:bg-[#1B254B] rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 border-2 border-primaryText dark:bg-cardDark rounded-full flex items-center justify-center">
                        <span className="text-primaryText dark:text-background font-bold">4</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-primaryText dark:text-background mb-2">Monitor & Update Content</h3>
                        <p className="text-gray-600 dark:text-secondaryText text-sm">
                            Use the dashboard to update your content, track visitor statistics, and analyze performance. All changes will automatically reflect on your portfolio through the API.
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-secondaryText list-disc list-inside">
                            <li>Real-time content updates without redeploying</li>
                            <li>Visitor analytics and engagement metrics</li>
                            <li>Content performance insights</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}