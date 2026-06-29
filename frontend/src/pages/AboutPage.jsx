function AboutPage() {
  return (
    <div className="about-page">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Sobre Nós</h1>
          <p className="text-lg text-slate-600">
            Conheça nossa história e missão no Kihavie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Nossa História
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Fundado em 2024, a Kihavie nasceu da visão de conectar
              vendedores e compradores de forma simples, segura e eficiente.
              Acreditamos que o comércio eletrônico deve ser acessível a todos,
              desde pequenos empreendedores até grandes marcas.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Começamos como uma pequena plataforma e hoje somos referência em
              qualidade e confiança no mercado brasileiro, oferecendo uma
              experiência de compra única para milhões de usuários.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Nossa Missão
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Democratizar o comércio eletrônico, oferecendo uma plataforma onde
              qualquer pessoa pode vender seus produtos e qualquer comprador
              pode encontrar exatamente o que precisa.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Nosso compromisso é com a transparência, segurança e satisfação de
              todos os nossos usuários, criando um ecossistema sustentável e
              próspero para o comércio brasileiro.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4 text-center">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Segurança
              </h3>
              <p className="text-slate-600">
                Protegemos seus dados e transações com os mais altos padrões de
                segurança.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Transparência
              </h3>
              <p className="text-slate-600">
                Somos claros em nossas políticas e processos, sempre priorizando
                a honestidade.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Inovação
              </h3>
              <p className="text-slate-600">
                Buscamos constantemente melhorar nossa plataforma com as
                melhores tecnologias.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Junte-se a nós!
          </h2>
          <p className="text-slate-600 mb-6">
            Seja você um vendedor ou comprador, faça parte da nossa comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/register"
              className="bg-blue-600 text-white active:shadow-red-500 active:shadow px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
            >
              Criar Conta
            </a>
            <a
              href="/"
              className="bg-slate-200 text-slate-900 active:shadow-blue-600 active:shadow px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition text-center"
            >
              Explorar Produtos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
