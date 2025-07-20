import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Scissors } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--card))_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Scissors className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-headline text-primary">BarberFlow</h1>
          </div>
          <CardTitle className="font-headline text-3xl tracking-wider">Bem-vindo de volta</CardTitle>
          <CardDescription className="font-body">Faça login para gerenciar sua barbearia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-headline tracking-wide text-base">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required className="h-12"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-headline tracking-wide text-base">Senha</Label>
              <Input id="password" type="password" placeholder="********" required className="h-12"/>
            </div>
            <Link href="/dashboard" passHref>
              <Button type="submit" size="lg" className="w-full font-headline text-xl tracking-wider mt-4">Entrar</Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
