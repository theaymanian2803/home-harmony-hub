import { useState, useMemo } from "react";
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@/data/mockData";

interface Props {
  propertyPrice?: number;
}

export default function MortgageCalculator({ propertyPrice = 350000 }: Props) {
  const { t } = useTranslation();
  const [homePrice, setHomePrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const calculation = useMemo(() => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / numPayments,
        totalPayment: principal,
        totalInterest: 0,
        downPayment,
        principal,
      };
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    return { monthlyPayment, totalPayment, totalInterest, downPayment, principal };
  }, [homePrice, downPaymentPercent, interestRate, loanTerm]);

  const principalPercent = (calculation.principal / (calculation.principal + calculation.totalInterest)) * 100;

  return (
    <div className="neu-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="neu-pressed rounded-xl p-3">
          <Calculator className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">Mortgage Calculator</h3>
          <p className="text-sm text-muted-foreground">Estimate your monthly payments</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          {/* Home Price */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <DollarSign className="h-4 w-4 text-accent" /> Home Price
            </label>
            <Input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="text-base font-semibold"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-foreground mb-2">
              <span>Down Payment</span>
              <span className="text-accent">{downPaymentPercent}% ({formatPrice(calculation.downPayment)})</span>
            </label>
            <Slider
              value={[downPaymentPercent]}
              onValueChange={([v]) => setDownPaymentPercent(v)}
              min={0}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-foreground mb-2">
              <span className="flex items-center gap-2"><Percent className="h-4 w-4 text-accent" /> Interest Rate</span>
              <span className="text-accent">{interestRate}%</span>
            </label>
            <Slider
              value={[interestRate]}
              onValueChange={([v]) => setInterestRate(Math.round(v * 10) / 10)}
              min={1}
              max={15}
              step={0.1}
              className="mt-2"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Calendar className="h-4 w-4 text-accent" /> Loan Term
            </label>
            <div className="flex gap-2">
              {[15, 20, 25, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    loanTerm === term
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-accent"
                  }`}
                >
                  {term} yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col items-center justify-center">
          <div className="neu-pressed rounded-2xl p-8 text-center w-full">
            <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
            <p className="font-display text-4xl font-bold text-accent">
              {formatPrice(Math.round(calculation.monthlyPayment))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">/month</p>
          </div>

          {/* Breakdown bar */}
          <div className="mt-6 w-full">
            <div className="h-3 rounded-full overflow-hidden bg-muted flex">
              <div
                className="bg-accent rounded-l-full transition-all"
                style={{ width: `${principalPercent}%` }}
              />
              <div
                className="bg-caramel rounded-r-full transition-all"
                style={{ width: `${100 - principalPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">Principal: {formatPrice(Math.round(calculation.principal))}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-caramel" />
                <span className="text-muted-foreground">Interest: {formatPrice(Math.round(calculation.totalInterest))}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 w-full grid grid-cols-2 gap-3">
            <div className="neu-card-sm p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Payment</p>
              <p className="font-display text-sm font-bold text-foreground">{formatPrice(Math.round(calculation.totalPayment))}</p>
            </div>
            <div className="neu-card-sm p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Interest</p>
              <p className="font-display text-sm font-bold text-foreground">{formatPrice(Math.round(calculation.totalInterest))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
