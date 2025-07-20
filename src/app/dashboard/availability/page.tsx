"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle } from "lucide-react";

const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default function AvailabilityPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <div>
                <h1 className="text-4xl font-headline tracking-wider text-foreground">Disponibilidade</h1>
                <p className="text-muted-foreground">Defina os dias e horários de trabalho para cada barbeiro.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="w-full md:w-1/2">
                        <Label htmlFor="barber-select" className="font-headline tracking-wide text-lg">Barbeiro</Label>
                        <Select>
                            <SelectTrigger id="barber-select">
                                <SelectValue placeholder="Selecione um barbeiro" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="joao">João Silva</SelectItem>
                                <SelectItem value="carlos">Carlos Pereira</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 rounded-lg border p-4">
                        <h3 className="font-headline tracking-wide text-lg">Dias de Trabalho</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {daysOfWeek.map(day => (
                                <div key={day} className="flex items-center space-x-2">
                                    <Checkbox id={day.toLowerCase()} defaultChecked={day !== "Domingo" && day !== "Segunda-feira"}/>
                                    <Label htmlFor={day.toLowerCase()} className="font-body">{day}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                        <h3 className="font-headline tracking-wide text-lg">Horário de Trabalho Padrão</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <Label htmlFor="start-time" className="font-body">Início</Label>
                                <Input id="start-time" type="time" defaultValue="09:00" />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="end-time" className="font-body">Fim</Label>
                                <Input id="end-time" type="time" defaultValue="18:00" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-headline tracking-wide text-lg">Intervalos</h3>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="w-full">
                                    <Label htmlFor="break-start-1" className="font-body">Início</Label>
                                    <Input id="break-start-1" type="time" defaultValue="12:00" />
                                </div>
                                <div className="w-full">
                                    <Label htmlFor="break-end-1" className="font-body">Fim</Label>
                                    <Input id="break-end-1" type="time" defaultValue="13:00" />
                                </div>
                                <Button variant="ghost" size="icon" className="self-end text-destructive hover:bg-destructive/10">
                                    <span className="sr-only">Remover intervalo</span>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <Button className="font-headline tracking-wider text-lg">Salvar Alterações</Button>
                     </div>

                </CardContent>
            </Card>
        </div>
    )
}
