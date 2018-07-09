
class Resultados{
    getResultados(req, res, next)
    {
        return(req.session.emailUserAdmin)
        ? res.render('graficasResultados/resultados',{title : 'Resultados', sesion : req.session.emailUserAdmin})
        : res.redirect('/notFound');
    }

    getResultadosHighCharts(req,res,next)
    {
        /*return(req.session.emailUserAdmin)
        ? res.render('graficasResultados/resultadosHighCharts',{title : 'Resultados', sesion : req.session.emailUserAdmin})
        : res.redirect('/notFound');*/
        res.render('graficasResultados/resultadosHighCharts',{title : "Resultado Final"});
    }
}

module.exports = Resultados;