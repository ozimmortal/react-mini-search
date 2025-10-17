import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function TestDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Open</Button>
			</DialogTrigger>
			<DialogContent>It works 🎉</DialogContent>
		</Dialog>
	)
}
