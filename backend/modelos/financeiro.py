from extensao import bd
from datetime import date


class Conta(bd.Model):
    __tablename__ = "contas"

    id = bd.Column(bd.Integer, primary_key=True)
    descricao = bd.Column(bd.String(200), nullable=False)
    valor = bd.Column(bd.Float, nullable=False)
    vencimento = bd.Column(bd.Date, nullable=False)
    paga = bd.Column(bd.Boolean, default=False)
    usuario_id = bd.Column(bd.Integer, bd.ForeignKey("usuarios.id"), nullable=False)

    def dias_para_vencer(self):
        return (self.vencimento - date.today()).days


class Assinatura(bd.Model):
    __tablename__ = "assinaturas"

    id = bd.Column(bd.Integer, primary_key=True)
    nome = bd.Column(bd.String(120), nullable=False)
    valor = bd.Column(bd.Float, nullable=False)
    ciclo = bd.Column(bd.String(20), nullable=False)
    ativa = bd.Column(bd.Boolean, default=True)
    usuario_id = bd.Column(bd.Integer, bd.ForeignKey("usuarios.id"), nullable=False)


class Meta(bd.Model):
    __tablename__ = "metas"

    id = bd.Column(bd.Integer, primary_key=True)
    nome = bd.Column(bd.String(120), nullable=False)
    valor_alvo = bd.Column(bd.Float, nullable=False)
    valor_atual = bd.Column(bd.Float, default=0.0)
    usuario_id = bd.Column(bd.Integer, bd.ForeignKey("usuarios.id"), nullable=False)

    def percentual(self):
        if self.valor_alvo == 0:
            return 0
        return round((self.valor_atual / self.valor_alvo) * 100, 1)
