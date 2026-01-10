import { AlertTriangle, Users, MessageSquare, Gift, Calendar, CheckCircle, Smartphone, Bell, Mail, RotateCcw, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface ReviewSubmitStepProps {
  formData: CampaignFormData;
}

const languageNames: Record<string, string> = {
  en: "English",
  am: "Amharic",
  or: "Afaan Oromo",
  ti: "Tigrigna",
  so: "Somali",
};

export function ReviewSubmitStep({ formData }: ReviewSubmitStepProps) {
  const selectedChannels = Object.entries(formData.channels)
    .filter(([_, enabled]) => enabled)
    .map(([channel]) => channel.toUpperCase());

  const estimatedCost = formData.type === "incentive" && formData.rewardValue
    ? formData.rewardValue * formData.totalCustomers
    : 0;

  const warnings: string[] = [];
  if (formData.totalCustomers > 100000) {
    warnings.push("Large audience: This campaign targets over 100,000 customers");
  }
  if (estimatedCost > 1000000) {
    warnings.push("High cost: Estimated reward cost exceeds 1,000,000 ETB");
  }

  // Get configured languages with their messages for SMS/USSD/App
  const getConfiguredLanguagesWithMessages = (channel: "sms" | "ussd" | "app") => {
    const messages = formData.channelMessages[channel];
    if (!messages) return [];
    return Object.entries(messages)
      .filter(([_, msg]) => msg && msg.trim().length > 0)
      .map(([lang, msg]) => ({
        language: languageNames[lang] || lang,
        message: msg,
      }));
  };

  const channelIcons = {
    sms: MessageSquare,
    ussd: Smartphone,
    app: Bell,
    email: Mail,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Review & Submit</h2>
        <p className="text-sm text-muted-foreground">Verify all details before submitting for approval</p>
      </div>

      <div className="space-y-6">
        {/* Campaign Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <CheckCircle className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Campaign Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="outline" className="capitalize">{formData.type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Objective</span>
              <span className="font-medium max-w-[200px] text-right">{formData.objective}</span>
            </div>
            {formData.description && (
              <div>
                <span className="text-muted-foreground">Description</span>
                <p className="mt-1">{formData.description}</p>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-medium">{formData.owner}</span>
            </div>
          </div>
        </div>

        {/* Audience Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Audience Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Selected Segments</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.selectedSegmentIds.length > 0 ? (
                  formData.selectedSegmentIds.map((id) => (
                    <Badge key={id} variant="outline">{id}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </div>
            </div>
            {formData.uploadedFileName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uploaded File</span>
                <span className="font-medium">{formData.uploadedFileName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Customers</span>
              <span className="font-bold text-lg">{formData.totalCustomers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Channel Configuration */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Channel Configuration</h3>
          </div>
          
          <div className="space-y-6">
            {/* SMS Channel */}
            {formData.channels.sms && (
              <div className="border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Channel: SMS</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Languages:</p>
                  <div className="space-y-3 pl-4">
                    {getConfiguredLanguagesWithMessages("sms").map((item) => (
                      <div key={item.language} className="space-y-1">
                        <p className="text-sm font-semibold">{item.language}</p>
                        <p className="text-sm bg-muted p-2 border-l-2 border-primary">{item.message}</p>
                      </div>
                    ))}
                    {getConfiguredLanguagesWithMessages("sms").length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No messages configured</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Cap per Channel</p>
                    <p className="font-medium">{formData.channelSettings.sms.cap?.toLocaleString() || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Retry on Failure</p>
                    <p className="font-medium flex items-center gap-1">
                      {formData.channelSettings.sms.retryOnFailure ? (
                        <><CheckCircle2 className="w-4 h-4 text-green-600" /> Yes</>
                      ) : (
                        "No"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Channel Priority</p>
                    <p className="font-medium">{formData.channelSettings.sms.priority || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* USSD Channel */}
            {formData.channels.ussd && (
              <div className="border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Channel: USSD</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Languages:</p>
                  <div className="space-y-3 pl-4">
                    {getConfiguredLanguagesWithMessages("ussd").map((item) => (
                      <div key={item.language} className="space-y-1">
                        <p className="text-sm font-semibold">{item.language}</p>
                        <p className="text-sm bg-muted p-2 border-l-2 border-primary">{item.message}</p>
                      </div>
                    ))}
                    {getConfiguredLanguagesWithMessages("ussd").length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No messages configured</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Cap per Channel</p>
                    <p className="font-medium">{formData.channelSettings.ussd.cap?.toLocaleString() || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Retry on Failure</p>
                    <p className="font-medium flex items-center gap-1">
                      {formData.channelSettings.ussd.retryOnFailure ? (
                        <><CheckCircle2 className="w-4 h-4 text-green-600" /> Yes</>
                      ) : (
                        "No"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Channel Priority</p>
                    <p className="font-medium">{formData.channelSettings.ussd.priority || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* App Push Channel */}
            {formData.channels.app && (
              <div className="border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Channel: App Push</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Languages:</p>
                  <div className="space-y-3 pl-4">
                    {getConfiguredLanguagesWithMessages("app").map((item) => (
                      <div key={item.language} className="space-y-1">
                        <p className="text-sm font-semibold">{item.language}</p>
                        <p className="text-sm bg-muted p-2 border-l-2 border-primary">{item.message}</p>
                      </div>
                    ))}
                    {getConfiguredLanguagesWithMessages("app").length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No messages configured</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Cap per Channel</p>
                    <p className="font-medium">{formData.channelSettings.app.cap?.toLocaleString() || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Retry on Failure</p>
                    <p className="font-medium flex items-center gap-1">
                      {formData.channelSettings.app.retryOnFailure ? (
                        <><CheckCircle2 className="w-4 h-4 text-green-600" /> Yes</>
                      ) : (
                        "No"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Channel Priority</p>
                    <p className="font-medium">{formData.channelSettings.app.priority || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Channel */}
            {formData.channels.email && (
              <div className="border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Channel: Email</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Languages:</p>
                  <div className="space-y-3 pl-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{languageNames[formData.emailContent.language] || "English"}</p>
                      <div className="bg-muted p-2 border-l-2 border-primary space-y-1">
                        <p className="text-sm"><strong>Subject:</strong> {formData.emailContent.subject || "Not set"}</p>
                        <p className="text-sm">{formData.emailContent.body || "No body content"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Cap per Channel</p>
                    <p className="font-medium">{formData.channelSettings.email.cap?.toLocaleString() || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Retry on Failure</p>
                    <p className="font-medium flex items-center gap-1">
                      {formData.channelSettings.email.retryOnFailure ? (
                        <><CheckCircle2 className="w-4 h-4 text-green-600" /> Yes</>
                      ) : (
                        "No"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Channel Priority</p>
                    <p className="font-medium">{formData.channelSettings.email.priority || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* No channels selected */}
            {!formData.channels.sms && !formData.channels.ussd && !formData.channels.app && !formData.channels.email && (
              <p className="text-sm text-muted-foreground italic">No channels configured</p>
            )}
          </div>
        </div>

        {/* Reward Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Gift className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Reward Summary</h3>
          </div>
          {formData.type === "incentive" ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Type</span>
                <span className="font-medium capitalize">{formData.rewardType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Value</span>
                <span className="font-medium">{formData.rewardValue} ETB</span>
              </div>
              {formData.rewardCapPerDay && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Cap</span>
                  <span className="font-medium">{formData.rewardCapPerDay.toLocaleString()} ETB</span>
                </div>
              )}
              {formData.rewardCapPerCustomer && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Per Customer Cap</span>
                  <span className="font-medium">{formData.rewardCapPerCustomer.toLocaleString()} ETB</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Account</span>
                <span className="font-medium">{formData.rewardAccountName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Estimated Total Cost</span>
                <span className="font-bold text-lg">{estimatedCost.toLocaleString()} ETB</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No rewards configured (Informational campaign)</p>
          )}
        </div>

        {/* Schedule Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Schedule & Controls</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Schedule Type</p>
              <p className="font-medium capitalize">{formData.scheduleType}</p>
            </div>
            {formData.scheduleType === "scheduled" && (
              <>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formData.startDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{formData.endDate}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-muted-foreground">Frequency Cap</p>
              <p className="font-medium capitalize">{formData.frequencyCap.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings Panel */}
      {warnings.length > 0 && (
        <div className="border border-warning/30 bg-warning/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Warnings</h3>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-warning">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
