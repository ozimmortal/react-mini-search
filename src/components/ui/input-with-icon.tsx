import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode
	iconPosition?: "left" | "right"
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
	({ className, icon, iconPosition = "left", ...props }, ref) => {
		return (
			<div className="relative w-full">
				<Input
					ref={ref}
					className={cn(
						iconPosition === "left" && "pl-10",
						iconPosition === "right" && "pr-10",
						className,
					)}
					{...props}
				/>
				{icon && (
					<div
						className={cn(
							"absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
							iconPosition === "left" ? "left-3" : "right-3",
						)}
					>
						{icon}
					</div>
				)}
			</div>
		)
	},
)

InputWithIcon.displayName = "InputWithIcon"

export { InputWithIcon }
