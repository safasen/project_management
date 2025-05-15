export default function MessageState({type, message}){
    return (
        <div className="mt-2">
            <h3 className={`roboto-medium ${type == "error" ? "text-red-500": "text-green-700"}`}>{message}</h3>
        </div>
    )
}