import Link from 'next/link';

import { fetchApplications } from '@/lib/admin/applicationsData';
import {
  fetchCrmTasks,
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from '@/lib/admin/tasksData';
import { TaskActions } from '@/components/crm/TaskActions';
import { TaskForm } from '@/components/crm/TaskForm';

export const metadata = {
  title: 'CRM Görevler',
};

export default async function CrmTasksPage() {
  const [applications, tasks] = await Promise.all([
    fetchApplications(),
    fetchCrmTasks(),
  ]);
  const applicationById = new Map(applications.map((app) => [app.id, app]));
  const openTasks = tasks.filter(
    (task) => task.status === 'open' || task.status === 'in_progress',
  );
  const doneTasks = tasks.filter((task) => task.status === 'done');
  const overdueTasks = openTasks.filter(
    (task) => task.dueAt && new Date(task.dueAt).getTime() < Date.now(),
  );

  return (
    <div className="mx-auto max-w-[1280px]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        İş Takibi
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">
        Görevler
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
        Açık leadler için ilk arama, evrak listesi, ödeme takibi ve randevu
        hazırlığı gibi operasyon görevleri.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Açık Görev
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {openTasks.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Geciken
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {overdueTasks.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tamamlanan
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {doneTasks.length}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <TaskForm applications={applications} />

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Görev Listesi
          </h2>
          <div className="mt-4 space-y-3">
            {tasks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Henüz görev oluşturulmadı.
              </p>
            ) : (
              tasks.map((task) => {
                const app = applicationById.get(task.applicationId);
                return (
                  <div
                    key={task.id}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-950">
                          {task.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {app ? (
                            <Link
                              href={`/crm/leads/${app.id}`}
                              className="font-semibold text-brand-base hover:text-brand-light"
                            >
                              {app.fullName}
                            </Link>
                          ) : (
                            task.applicationId
                          )}{' '}
                          · {getTaskStatusLabel(task.status)} ·{' '}
                          {getTaskPriorityLabel(task.priority)}
                          {task.dueAt
                            ? ` · ${new Date(task.dueAt).toLocaleString('tr-TR')}`
                            : ''}
                        </p>
                        {task.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <TaskActions
                        taskId={task.id}
                        initialStatus={task.status}
                        initialPriority={task.priority}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          { title: 'Açık', hint: 'Başlanacak görevler', items: openTasks },
          { title: 'İşlemde', hint: 'Devam eden takipler', items: tasks.filter((task) => task.status === 'in_progress') },
          { title: 'Geciken', hint: 'SLA riski olan görevler', items: overdueTasks },
        ].map((column) => (
          <div key={column.title} className="panel p-5">
            <h2 className="text-base font-semibold text-slate-950">
              {column.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500">{column.hint}</p>
            <div className="mt-4 space-y-3">
              {column.items.length === 0 ? (
                <p className="text-sm text-slate-500">Açık görev yok.</p>
              ) : (
                column.items.slice(0, 4).map((task) => {
                  const app = applicationById.get(task.applicationId);
                  return (
                  <Link
                    key={`${column.title}-${task.id}`}
                    href={`/crm/leads/${task.applicationId}`}
                    className="block rounded-xl border border-slate-200 bg-white px-3 py-3 hover:border-blue-300"
                  >
                    <p className="font-semibold text-slate-900">
                      {task.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {app?.fullName || task.applicationId}
                    </p>
                  </Link>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
