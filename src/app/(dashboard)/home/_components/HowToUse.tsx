import Image from "next/image";

export default function HowToUse() {
    return (
        <div className="bg-white p-4 md:p-8 rounded-xl border border-gray-100 w-full max-w-[80rem] mx-auto my-6">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primaryText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Transform Your Static Portfolio to Dynamic
                </h2>
                <p className="text-secondaryText text-sm sm:text-base">
                    Easily convert your static portfolio website into a dynamic one without backend setup. Just make API calls to fetch and display your content.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Authenticate with DevSpace</h3>
                        <p className="text-gray-600 text-sm">
                            Use your DevSpace credentials to access the dashboard. DevSpace provides the infrastructure to manage your portfolio content, blogs, and articles in one place.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Get Your API Endpoint</h3>
                        <p className="text-gray-600 text-sm">
                            Generate a unique API URL from your dashboard. This endpoint will serve all your portfolio data in JSON format, ready to be consumed by your static website.
                        </p>
                        <div className="mt-3 p-3 bg-white rounded-md border border-gray-200 text-xs font-mono text-gray-700 overflow-x-auto">
                            https://api.devspace.me/v1/username/data
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Integrate with Your Portfolio</h3>
                        <p className="text-gray-600 text-sm">
                            Add this simple fetch code to your static site to make it dynamic. No backend required - just pure frontend API calls.
                        </p>
                        <Image src={"/how-to-use-devspace-api-call.png"} alt="API Integration Example" width={600} height={400} className="mt-3 rounded-md shadow-sm" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">4</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Monitor & Update Content</h3>
                        <p className="text-gray-600 text-sm">
                            Use the dashboard to update your content, track visitor statistics, and analyze performance. All changes will automatically reflect on your portfolio through the API.
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                            <li>Real-time content updates without redeploying</li>
                            <li>Visitor analytics and engagement metrics</li>
                            <li>Content performance insights</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pro Tip
                </h3>
                <p className="text-gray-600 text-sm">
                    For better performance, implement client-side caching of your API responses. This reduces load times for repeat visitors while still keeping your content up-to-date.
                </p>
            </div>
        </div>
    );
}