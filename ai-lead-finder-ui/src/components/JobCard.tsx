export default function JobCard({ job }: any) {
  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold">{job.position}</h2>
      <p className="text-sm text-gray-600">{job.company} - {job.location}</p>
      <a className="text-blue-500 underline text-sm" href={job.url} target="_blank">
        View Job
      </a>
    </div>
  );
}
