export default interface AuditLog {
    id: number
    date: string
    time: string
    user: string
    change_type: string
    record_type: string
    record_id: number;
    old_value: string
    new_value: string
    message: string
    created_at: string
}
