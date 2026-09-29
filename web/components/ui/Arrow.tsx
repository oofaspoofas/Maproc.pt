import {
  ArrowUpRightIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";
export function Arrow({
  diagonal = false,
  size = 20,
}: {
  diagonal?: boolean;
  size?: number;
}) {
  const Icon = diagonal ? ArrowUpRightIcon : ArrowRightIcon;
  return <Icon size={size} weight="regular" aria-hidden="true" />;
}
