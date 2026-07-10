
type ReportResumeCardProps = {
    title: string;
    value: string;
    themeColor: string;
    desc?: string;
}

export function ReportResumeCard({title, value, themeColor, desc}:ReportResumeCardProps) {
  return (
    <div className="border-[1px] w-[100px] rounded-[4px] p-2 border-gray-200 flex flex-col items-center gap-1">
        <p className="font-semibold">{title}</p>
        <p className="font-bold text-emerald-600" style={{color: themeColor}}>{value}</p>
        <p>{desc}</p>
    </div>
  );
}

export default ReportResumeCard;