from extensao import bd
from modelos.financeiro import Meta


class MetaRepositorio:

    def listar_por_usuario(self, usuario_id):
        return Meta.query.filter_by(usuario_id=usuario_id).order_by(Meta.nome).all()

    def buscar_por_id(self, meta_id, usuario_id):
        return Meta.query.filter_by(id=meta_id, usuario_id=usuario_id).first()

    def salvar(self, meta):
        bd.session.add(meta)
        bd.session.commit()
        return meta

    def excluir(self, meta):
        bd.session.delete(meta)
        bd.session.commit()

    def atualizar_valor(self, meta, valor_atual):
        meta.valor_atual = valor_atual
        bd.session.commit()
        return meta
