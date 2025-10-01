import Link from "next/link"

export default function LinkComponent(props) {
    return <Link href={props?.href || ''}>{props.title || ''}</Link>
}