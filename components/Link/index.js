import Link from "next/link"

export default function Link(props) {
    return <Link href={props?.href || ''}>{props.title || ''}</Link>
}