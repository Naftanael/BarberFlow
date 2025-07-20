"use client"
import Link from "next/link";
import Image from "next/image"
import {
  Bell,
  Calendar,
  Clock,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Scissors,
  Search,
  Settings,
  ShoppingCart,
  Users,
  Users2,
  LayoutDashboard
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Chatbot from "@/components/chatbot";

const NavLink = ({ href, icon: Icon, tooltip }: { href: string; icon: React.ElementType; tooltip: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Link
                href={href}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{tooltip}</span>
            </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
    <div className="flex min-h-screen w-full flex-col bg-background">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-card sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
                href="/dashboard"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
                <Scissors className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">BarberFlow</span>
            </Link>
            <NavLink href="/dashboard" icon={LayoutDashboard} tooltip="Painel" />
            <NavLink href="/dashboard/agenda" icon={Calendar} tooltip="Agenda" />
            <NavLink href="/dashboard/services" icon={Scissors} tooltip="Serviços" />
            <NavLink href="/dashboard/barbers" icon={Users} tooltip="Barbeiros" />
            <NavLink href="/dashboard/availability" icon={Clock} tooltip="Disponibilidade" />
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <NavLink href="#" icon={Settings} tooltip="Configurações" />
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-card">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Scissors className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">BarberFlow</span>
                </Link>
                <Link href="/dashboard" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><LayoutDashboard className="h-5 w-5" />Painel</Link>
                <Link href="/dashboard/agenda" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Calendar className="h-5 w-5" />Agenda</Link>
                <Link href="/dashboard/services" className="flex items-center gap-4 px-2.5 text-foreground"><Scissors className="h-5 w-5" />Serviços</Link>
                <Link href="/dashboard/barbers" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Users className="h-5 w-5" />Barbeiros</Link>
                <Link href="/dashboard/availability" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Clock className="h-5 w-5" />Disponibilidade</Link>
                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Settings className="h-5 w-5" />Configurações</Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="relative ml-auto flex-1 md:grow-0">
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="https://placehold.co/36x36.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                  data-ai-hint="barber portrait"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
      <Chatbot />
    </div>
    </TooltipProvider>
  );
}
