import { CircleCheck, CircleX, CircleAlert, BarChart3 } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import './Comparison.css'

const FEATURES_LIST = [
    { feature: 'UPI-native buy flow', satmix: true, wazirx: 'partial', coindcx: 'partial', binance: false },
    { feature: 'Vernacular language', satmix: true, wazirx: false, coindcx: false, binance: false },
    { feature: '< 3 min KYC', satmix: true, wazirx: 'partial', coindcx: 'partial', binance: 'partial' },
    { feature: 'P2P Trading', satmix: true, wazirx: true, coindcx: false, binance: true },
    { feature: 'Learn & Earn', satmix: true, wazirx: false, coindcx: true, binance: true },
    { feature: 'India data residency', satmix: true, wazirx: false, coindcx: true, binance: false },
    { feature: 'Proof of Reserves', satmix: true, wazirx: false, coindcx: false, binance: true },
    { feature: 'Trading fee', satmix: '0.1%', wazirx: '0.2%', coindcx: '0.1%', binance: '0.1%' },
]

function renderCell(val) {
    if (val === true) return <span className="comp__check"><CircleCheck size={20} /></span>
    if (val === false) return <span className="comp__cross"><CircleX size={20} /></span>
    if (val === 'partial') return <span className="comp__partial"><CircleAlert size={20} /></span>
    return <span className="comp__text">{val}</span>
}

export default function Comparison() {
    return (
        <section className="comparison section" id="comparison">
            <div className="container">
                <ScrollReveal>
                    <div className="badge">
                        <BarChart3 size={14} /> Compare
                    </div>
                    <h2 className="section-title">
                        Why Switch to <span className="gradient-text">Satmix?</span>
                    </h2>
                    <p className="section-subtitle">
                        See how Satmix stacks up against India's top crypto exchanges.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <div className="comp__table-wrap">
                        <table className="comp__table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th className="comp__highlight-col">Satmix</th>
                                    <th>WazirX</th>
                                    <th>CoinDCX</th>
                                    <th>Binance IN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FEATURES_LIST.map((row, i) => (
                                    <tr key={i}>
                                        <td className="comp__feature-name">{row.feature}</td>
                                        <td className="comp__highlight-col">{renderCell(row.satmix)}</td>
                                        <td>{renderCell(row.wazirx)}</td>
                                        <td>{renderCell(row.coindcx)}</td>
                                        <td>{renderCell(row.binance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
