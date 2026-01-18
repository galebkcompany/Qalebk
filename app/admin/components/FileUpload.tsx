export default function FileUpload() {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <label className="block font-medium mb-1">صورة المنتج</label>
      <input type="file" className="border rounded px-3 py-2 w-full" />
    </div>
  )
}
