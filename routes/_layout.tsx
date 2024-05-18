import { PageProps } from "$fresh/server.ts";

export default function Layout({Component, state}: PageProps) {
    return (
        <div class="layout">
            <div class="header">
                <a href="/">Films</a>
                <a href="/projects">Projects</a>
            </div>
            <Component/>
        </div>
    )
}