import { type Application, Reflection, RendererEvent } from "typedoc"
import { writeFileSync } from "node:fs"
import { join } from "node:path"

export function load(app: Application): void {
    app.renderer.on(RendererEvent.END, (event: RendererEvent) => {
        const map: Record<string, string> = {}

        for (const page of event.pages ?? []) {
            const model = page.model
            if (!(model instanceof Reflection) || model.isProject()) continue
            map[model.getFullName()] = page.url
            map[model.name] ??= page.url // short name, first one wins
        }

        writeFileSync(
            join(event.outputDirectory, "links.json"),
            JSON.stringify(map, null, 4),
        )
    })
}