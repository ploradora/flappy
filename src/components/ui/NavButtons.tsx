import { ButtonNavWrapper } from "./ButtonNav"

export const NavButtons = () => {
  return (
    <div className="flex justify-between items-center gap-1 mt-10 max-w-[450px] m-auto">
      <ButtonNavWrapper href="/results" title="Results" />
      <ButtonNavWrapper href="/submit" title="Submit" />
    </div>
  )
}