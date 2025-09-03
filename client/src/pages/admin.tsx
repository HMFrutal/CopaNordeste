import { Link } from "wouter";
import { 
  Trophy, 
  Users, 
  UserCog, 
  Flag, 
  Settings,
  BarChart3,
  Calendar,
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const adminModules = [
    {
      title: "Campeonatos",
      description: "Gerencie campeonatos e competições",
      icon: Trophy,
      href: "/admin/championships",
      color: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Times",
      description: "Cadastre e edite informações dos times",
      icon: Users,
      href: "/admin/teams",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Atletas",
      description: "Gerencie o cadastro de atletas",
      icon: UserCog,
      href: "/admin/athletes",
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Árbitros",
      description: "Cadastre e gerencie árbitros",
      icon: Flag,
      href: "/admin/referees",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Relatórios",
      description: "Visualize estatísticas e relatórios",
      icon: BarChart3,
      href: "/admin/reports",
      color: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Agenda",
      description: "Gerencie jogos e eventos",
      icon: Calendar,
      href: "/admin/schedule",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Notícias",
      description: "Publique e edite notícias",
      icon: FileText,
      href: "/admin/news",
      color: "text-teal-600 dark:text-teal-400"
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-600 dark:text-gray-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Copa Nordeste 2025 - Gestão do Torneio
              </p>
            </div>
            <Link href="/">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer" data-testid="link-back-home">
                Voltar ao Site
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Times</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atletas Cadastrados</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">368</div>
              <p className="text-xs text-muted-foreground">+12 esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jogos Agendados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">16 esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Árbitros Ativos</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Todos credenciados</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminModules.map((module) => {
            const IconComponent = module.icon;
            
            return (
              <Link key={module.title} href={module.href}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" data-testid={`admin-card-${module.title.toLowerCase()}`}>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <IconComponent className={`h-12 w-12 ${module.color}`} />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/championships/new">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" data-testid="quick-action-new-championship">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <h3 className="font-semibold">Novo Campeonato</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Criar novo torneio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/teams/new">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" data-testid="quick-action-new-team">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-semibold">Cadastrar Time</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Adicionar novo time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/athletes/new">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" data-testid="quick-action-new-athlete">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <UserCog className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold">Cadastrar Atleta</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Adicionar novo atleta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}