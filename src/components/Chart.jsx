export const Chart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.amount), 1);

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 h-80 w-full overflow-hidden">
            <h3 className="text-lg font-bold mb-6">Enquiries per Listing</h3>
            <div className="flex flex-col gap-3 w-full h-60 overflow-y-auto pr-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 w-full">
                        <span className="text-xs text-gray-600 w-1/3 truncate text-right">
                            {item.name}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-sm h-6">
                            <div
                                className="bg-blue-500 h-full rounded-sm hover:bg-blue-600 transition-all"
                                style={{
                                    width: item.amount > 0 ? `${(item.amount / maxVal) * 100}%` : '0%',
                                    minWidth: item.amount > 0 ? '20px' : '0px'
                                }}
                            />
                        </div>
                        <span className="text-xs font-bold w-8">{item.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};